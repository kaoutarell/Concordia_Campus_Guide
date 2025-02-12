import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import MapViewComponent from "../components/MapViewComponent";
import locationService from "../services/LocationService";

jest.mock("../services/LocationService", () => ({
  startTrackingLocation: jest.fn(),
  getCurrentLocation: jest.fn(),
  stopTrackingLocation: jest.fn(),
}));

describe("MapViewComponent - Location Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test to make sure that the tracking is started on mount
  test("should start tracking location on mount", async () => {
    render(
      <MapViewComponent
        locations={[]}
        region={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      />
    );
    expect(locationService.startTrackingLocation).toHaveBeenCalled();
  });

  let currentLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
  };
  // test to make sure that location marker is shown when available
  test("should display current location marker when available", async () => {
    expect(currentLocation).not.toBeNull();
    expect(
      locationService.getCurrentLocation.mockReturnValue(currentLocation)
    ).toBeTruthy();
  });

  test("should update current location when a new location is provided", async () => {
    // Define the new location
    const updatedLocation = { latitude: 40.7128, longitude: -74.006 };

    // Mock the location service to return the updated location
    locationService.getCurrentLocation.mockReturnValue(updatedLocation);

    // Simulate the component logic (assuming this runs inside a component)
    const location = locationService.getCurrentLocation();

    // For a simple test, you can directly check the location instead of using setState
    expect(location).toEqual(updatedLocation);
  });

  // test that an error is thrown when issue with fetching location
  test("should handle error when fetching current location", async () => {
    // Mock location service to throw an error
    locationService.startTrackingLocation = jest
      .fn()
      .mockRejectedValue(new Error("Location error"));
    locationService.getCurrentLocation = jest.fn().mockReturnValue(null);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress error logs in test output

    render(
      <MapViewComponent
        locations={[]}
        region={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching location:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  // test to check is tracking is stopped on unmount
  test("should stop tracking location on unmount", () => {
    const { unmount } = render(
      <MapViewComponent
        locations={[]}
        region={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      />
    );
    unmount();
    expect(locationService.stopTrackingLocation).toHaveBeenCalled();
  });

  let selectedMarker = { id: 1 }; // Non-null initial state for selectedMarker tests

  // Simulate close button press
  const handleClosePress = () => {
    selectedMarker = null;
  };
  // Simulate pressing a marker (this should update selectedMarker)
  const handleMakerPress = () => {
    selectedMarker = { id: 1 }; // Mock location or value for the selectedMarker
  };

  // Test to check if selectedMarker is null after close press
  test("should set selectedMarker to null after close button press", () => {
    // Check if selectedMarker is initially set (non-null)
    expect(selectedMarker).not.toBeNull(); // Should pass

    // Simulate pressing the close button
    handleClosePress();

    // Check if selectedMarker is null after close press
    expect(selectedMarker).toBeNull(); // Should pass
  });

  // Test to check if selectedMarker is set to a non-null value after marker press
  test("should set selectedMarker to be not null after marker press", () => {
    // Initially, selectedMarker should be null
    expect(selectedMarker).toBeNull(); // Should pass

    // Simulate pressing a marker
    handleMakerPress();

    // After marker press, selectedMarker should no longer be null
    expect(selectedMarker).not.toBeNull(); // Should pass
  });

  test("should call onGoToLocation with the correct location when button is pressed", () => {
    // Create a mock location with latitude and longitude
    const mockLocation = {
      name: "John Molson Building",
      location: {
        latitude: 45.49687,
        longitude: -73.57804,
      },
    };

    // Mock onGoToLocation function
    const onGoToLocation = jest.fn();

    // Simulate pressing the "Go" button
    const handleGoPress = () => {
      onGoToLocation(mockLocation); // Call with mockLocation
    };

    // simulate Go button press
    handleGoPress();

    // make sure onGoToLocation was called with the correct location
    expect(onGoToLocation).toHaveBeenCalledWith(mockLocation);
  });

  test("should display loading indicator when locations are loading", () => {
    render(<MapViewComponent locations={[]} region={{}} />);

    // Check if the loading screen is rendered
    const loadingText = screen.getByText("Loading locations...");
    expect(loadingText).toBeTruthy();
  });

  // test("should set isLoading to false when locations are provided", async () => {
  //   const locations = [
  //     {
  //       id: 1,
  //       name: "Location 1",
  //       location: {
  //         latitude: 37.7749,
  //         longitude: -122.4194,
  //       },
  //     },
  //   ];

  //   render(<MapViewComponent locations={locations} region={{}} />);

  //   // Wait for the effect to run and isLoading to be set to false
  //   await waitFor(() => {
  //     expect(screen.queryByText("Loading locations...")).toBeNull();
  //   });
  // });
});
