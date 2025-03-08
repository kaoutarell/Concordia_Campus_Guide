import { getMyCurrentLocation, getDefaultDestination } from "../utils/defaultLocations";
import locationService from "../services/LocationService";

// Mock LocationService
jest.mock("../services/LocationService", () => ({
  startTrackingLocation: jest.fn(),
  getCurrentLocation: jest.fn(),
}));

describe("Default Locations Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return current location when available", async () => {
    // Setup mock response
    const mockCurrentLocation = {
      coords: {
        latitude: 45.497,
        longitude: -73.579,
      },
    };
    locationService.getCurrentLocation.mockReturnValue(mockCurrentLocation);

    const result = await getMyCurrentLocation();

    expect(locationService.startTrackingLocation).toHaveBeenCalled();
    expect(locationService.getCurrentLocation).toHaveBeenCalled();
    expect(result).toEqual({
      location: {
        latitude: 45.497,
        longitude: -73.579,
      },
      civic_address: "Current Location",
    });
  });

  it("should return default destination when location is not available", async () => {
    // Setup mock to return null location
    locationService.getCurrentLocation.mockReturnValue(null);

    const result = await getMyCurrentLocation();
    const defaultDest = getDefaultDestination();

    expect(locationService.startTrackingLocation).toHaveBeenCalled();
    expect(locationService.getCurrentLocation).toHaveBeenCalled();
    expect(result).toEqual(defaultDest);
  });

  it("should return default destination when location has no coords", async () => {
    // Setup mock with missing coords
    locationService.getCurrentLocation.mockReturnValue({});

    const result = await getMyCurrentLocation();
    const defaultDest = getDefaultDestination();

    expect(result).toEqual(defaultDest);
  });

  it("should handle errors gracefully", async () => {
    // Setup mock to throw error
    locationService.startTrackingLocation.mockRejectedValue(new Error("Location error"));

    const result = await getMyCurrentLocation();
    const defaultDest = getDefaultDestination();

    expect(result).toEqual(defaultDest);
  });

  it("should return correct default destination", () => {
    const defaultDestination = getDefaultDestination();

    expect(defaultDestination).toEqual({
      location: {
        latitude: 45.4972159,
        longitude: -73.5794777,
      },
      civic_address: "Concordia University",
    });
  });
});
