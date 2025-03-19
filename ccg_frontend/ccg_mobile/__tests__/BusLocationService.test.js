import busLocationService from "../services/BusLocationService";

// Mock fetch
global.fetch = jest.fn();

describe("BusLocationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the bus locations and observers
    busLocationService.busLocations = [];
    busLocationService.observers = [];

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
    it("should return the a new instance if it was null and return the same if already defined", () => {
      const BusLocationService = require("../services/BusLocationService").BusLocationService;

      BusLocationService.instance = null;

      // check that the instance is null
      expect(BusLocationService.instance).toBeNull();

      const instance = BusLocationService.getInstance();
      // check that the instance is not null
      expect(instance).not.toBeNull();

      const instance2 = BusLocationService.getInstance();
      // check that the instance is the same
      expect(instance).toBe(instance2);
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

  describe("Observer Pattern", () => {
    it("should attach an observer function", () => {
      const observer = jest.fn();
      busLocationService.attach(observer);
      
      expect(busLocationService.observers).toContain(observer);
    });

    it("should ignore non-function observers", () => {
      busLocationService.attach("not a function");
      busLocationService.attach({});
      busLocationService.attach(null);
      
      expect(busLocationService.observers).toHaveLength(0);
    });

    it("should detach an observer function", () => {
      const observer1 = jest.fn();
      const observer2 = jest.fn();
      
      busLocationService.attach(observer1);
      busLocationService.attach(observer2);
      expect(busLocationService.observers).toHaveLength(2);
      
      busLocationService.detach(observer1);
      expect(busLocationService.observers).toHaveLength(1);
      expect(busLocationService.observers).not.toContain(observer1);
      expect(busLocationService.observers).toContain(observer2);
    });

    it("should notify all observers with current bus locations", () => {
      const observer1 = jest.fn();
      const observer2 = jest.fn();
      
      busLocationService.attach(observer1);
      busLocationService.attach(observer2);
      
      // Setup some test data
      const testLocations = [
        { id: "BUS1", latitude: 45.5, longitude: -73.6 }
      ];
      busLocationService.busLocations = testLocations;
      
      busLocationService.notify();
      
      expect(observer1).toHaveBeenCalledWith(testLocations);
      expect(observer2).toHaveBeenCalledWith(testLocations);
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
    it("should fetch bus data successfully and notify observers", async () => {
      // Setup mock observer
      const mockObserver = jest.fn();
      busLocationService.attach(mockObserver);

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

      // Check if observer was notified
      expect(mockObserver).toHaveBeenCalledWith(busLocationService.busLocations);
    });

    it("should handle missing Points array in response and notify observers", async () => {
      // Setup mock observer
      const mockObserver = jest.fn();
      busLocationService.attach(mockObserver);

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

      // Check if observer was notified with empty array
      expect(mockObserver).toHaveBeenCalledWith([]);

      consoleSpy.mockRestore();
    });

    it("should handle errors when fetching bus data and still notify observers", async () => {
      // Setup mock observer
      const mockObserver = jest.fn();
      busLocationService.attach(mockObserver);

      // Mock successful session cookie fetch
      busLocationService.fetchSessionCookie = jest.fn().mockResolvedValue("session=abc123");

      // Mock failed fetch
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await busLocationService.fetchBusData();

      expect(consoleSpy).toHaveBeenCalled();
      expect(busLocationService.busLocations).toEqual([]);

      // Check if observer was notified even though there was an error
      expect(mockObserver).toHaveBeenCalledWith([]);

      consoleSpy.mockRestore();
    });

    it("should handle missing session cookie", async () => {
      // Setup mock observer
      const mockObserver = jest.fn();
      busLocationService.attach(mockObserver);

      // Mock null session cookie result
      busLocationService.fetchSessionCookie = jest.fn().mockResolvedValue(null);

      // Mock successful bus data fetch
      const mockBusData = {
        d: {
          Points: [{ ID: "BUS1", Latitude: 45.5, Longitude: -73.6 }],
        },
      };

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockBusData),
      });

      await busLocationService.fetchBusData();

      // Verify that fetch was called without Cookie header
      expect(fetch).toHaveBeenCalledWith(
        "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
        expect.objectContaining({
          method: "POST",
          headers: expect.not.objectContaining({
            Cookie: expect.anything(),
          }),
        })
      );

      // Should still process bus data correctly
      expect(busLocationService.busLocations).toHaveLength(1);

      // Check if observer was notified
      expect(mockObserver).toHaveBeenCalledWith(busLocationService.busLocations);
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
