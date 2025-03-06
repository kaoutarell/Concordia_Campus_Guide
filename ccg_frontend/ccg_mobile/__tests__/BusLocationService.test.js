import busLocationService from "../services/BusLocationService";

// Mock fetch
global.fetch = jest.fn();

describe("BusLocationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the bus locations
    busLocationService.busLocations = [];

    // Mock intervals
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance when getInstance is called", () => {
      const instance1 = busLocationService;
      const instance2 = require("../services/BusLocationService").default;

      expect(instance1).toBe(instance2);
    });

    it("should throw error when trying to create a new instance directly", () => {
      const BusLocationService = require("../services/BusLocationService").BusLocationService;

      // This relies on implementation details, but we need to test the constructor
      try {
        new BusLocationService();
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Use BusLocationService.getInstance()");
      }
    });
  });

  describe("fetchSessionCookie", () => {
    it("should fetch session cookie successfully", async () => {
      const mockHeaders = new Headers();
      mockHeaders.append("set-cookie", "session=abc123");

      // Mock successful fetch
      fetch.mockResolvedValueOnce({
        headers: {
          get: jest.fn().mockReturnValue("session=abc123"),
        },
      });

      const result = await busLocationService.fetchSessionCookie();

      expect(fetch).toHaveBeenCalledWith(
        "https://shuttle.concordia.ca/concordiabusmap/Map.aspx",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Host: "shuttle.concordia.ca",
          }),
        })
      );

      expect(result).toBe("session=abc123");
    });

    it("should handle errors when fetching session cookie", async () => {
      // Mock failed fetch
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await busLocationService.fetchSessionCookie();

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe("fetchBusData", () => {
    it("should fetch bus data successfully", async () => {
      // Mock successful session cookie fetch
      busLocationService.fetchSessionCookie = jest.fn().mockResolvedValue("session=abc123");

      // Mock successful bus data fetch
      const mockBusData = {
        d: {
          Points: [
            { ID: "BUS1", Latitude: 45.5, Longitude: -73.6 },
            { ID: "BUS2", Latitude: 45.51, Longitude: -73.59 },
            { ID: "NonBus", Latitude: 45.52, Longitude: -73.58 }, // This should be filtered out
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockBusData),
      });

      await busLocationService.fetchBusData();

      expect(busLocationService.fetchSessionCookie).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Host: "shuttle.concordia.ca",
            "Content-Type": "application/json; charset=UTF-8",
            Cookie: "session=abc123",
          }),
        })
      );

      // Check if bus data is filtered correctly
      expect(busLocationService.busLocations).toHaveLength(2);
      expect(busLocationService.busLocations[0]).toEqual({
        id: "BUS1",
        latitude: 45.5,
        longitude: -73.6,
      });
    });

    it("should handle missing Points array in response", async () => {
      // Mock successful session cookie fetch
      busLocationService.fetchSessionCookie = jest.fn().mockResolvedValue("session=abc123");

      // Mock response with missing Points array
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ d: {} }),
      });

      // Spy on console.warn
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      await busLocationService.fetchBusData();

      expect(consoleSpy).toHaveBeenCalled();
      expect(busLocationService.busLocations).toEqual([]);

      consoleSpy.mockRestore();
    });

    it("should handle errors when fetching bus data", async () => {
      // Mock successful session cookie fetch
      busLocationService.fetchSessionCookie = jest.fn().mockResolvedValue("session=abc123");

      // Mock failed fetch
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await busLocationService.fetchBusData();

      expect(consoleSpy).toHaveBeenCalled();
      expect(busLocationService.busLocations).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe("startTracking", () => {
    it("should start tracking with default interval", () => {
      // Mock fetchBusData
      busLocationService.fetchBusData = jest.fn();

      busLocationService.startTracking();

      expect(busLocationService.fetchBusData).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);

      // Simulate time passing and check if fetchBusData is called again
      jest.advanceTimersByTime(5000);
      expect(busLocationService.fetchBusData).toHaveBeenCalledTimes(2);
    });

    it("should start tracking with custom interval", () => {
      // Mock fetchBusData
      busLocationService.fetchBusData = jest.fn();

      busLocationService.startTracking(10000);

      expect(busLocationService.fetchBusData).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);

      // Simulate time passing and check if fetchBusData is called again
      jest.advanceTimersByTime(10000);
      expect(busLocationService.fetchBusData).toHaveBeenCalledTimes(2);
    });

    it("should stop previous tracking when starting new tracking", () => {
      // Mock fetchBusData
      busLocationService.fetchBusData = jest.fn();

      // Mock an existing interval
      busLocationService.intervalId = 123;

      busLocationService.startTracking();

      expect(clearInterval).toHaveBeenCalledWith(123);
      expect(busLocationService.intervalId).not.toBe(123);
    });
  });

  describe("stopTracking", () => {
    it("should clear interval when tracking is active", () => {
      // Set up an interval ID
      busLocationService.intervalId = 123;

      busLocationService.stopTracking();

      expect(clearInterval).toHaveBeenCalledWith(123);
      expect(busLocationService.intervalId).toBeNull();
    });

    it("should do nothing when no tracking is active", () => {
      // Ensure interval ID is null
      busLocationService.intervalId = null;

      busLocationService.stopTracking();

      expect(clearInterval).not.toHaveBeenCalled();
      expect(busLocationService.intervalId).toBeNull();
    });
  });

  describe("getBusLocations", () => {
    it("should return current bus locations", () => {
      // Set up some test data
      const testLocations = [
        { id: "BUS1", latitude: 45.5, longitude: -73.6 },
        { id: "BUS2", latitude: 45.51, longitude: -73.59 },
      ];

      busLocationService.busLocations = testLocations;

      const result = busLocationService.getBusLocations();

      expect(result).toBe(testLocations);
    });

    it("should return empty array when no locations are available", () => {
      busLocationService.busLocations = [];

      const result = busLocationService.getBusLocations();

      expect(result).toEqual([]);
    });
  });
});
