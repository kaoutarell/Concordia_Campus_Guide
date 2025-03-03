import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapViewComponent from "../components/map-screen-ui/sections/MapViewComponent";
import locationService from "../services/LocationService";
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn().mockImplementation(obj => obj.ios)
}));

// Mock the location service
jest.mock("../services/LocationService", () => ({
  startTrackingLocation: jest.fn(),
  getCurrentLocation: jest.fn(),
  stopTrackingLocation: jest.fn(),
}));

// Mock transformCurrentLoc
jest.mock("../utils/transformCurrentLoc", () => {
  return jest.fn(location => ({
    building_code: "CURR_LOC",
    civic_address: "Your Location",
    id: 1,
    location: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    name: "Current location"
  }));
});

// Mock the map view
jest.mock("react-native-maps", () => {
  const { View } = require('react-native');
  const MockMapView = ({ children, onRegionChangeComplete, onPress, testID }) => (
    <View testID={testID || "map-view"}>
      {children}
      <button data-testid="region-change-button" onClick={() => onRegionChangeComplete ? onRegionChangeComplete({ latitude: 45.5, longitude: -73.6, latitudeDelta: 0.01, longitudeDelta: 0.01 }) : null}>
        Change Region
      </button>
      <button data-testid="map-press-button" onClick={() => onPress ? onPress() : null}>Press Map</button>
    </View>
  );
  MockMapView.Marker = ({ coordinate, title, pinColor, testID }) => (
    <View testID={testID || "marker"}>
      <span>{title}</span>
      <span>{coordinate.latitude}</span>
      <span>{coordinate.longitude}</span>
      <span>{pinColor}</span>
    </View>
  );
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMapView.Marker,
  };
});

// Mock InfoPopup
jest.mock("../components/map-screen-ui/elements/InfoPopUp.js", () => {
  return function MockInfoPopup({ value, onClose, onGo }) {
    return (
      <div data-testid="info-popup">
        <button data-testid="popup-close" onClick={() => onClose()}>Close</button>
        <button data-testid="popup-go" onClick={() => onGo(value)}>Go</button>
      </div>
    );
  };
});

// Mock CustomMarker
jest.mock("../components/map-screen-ui/elements/CustomMarker.js", () => {
  return function MockCustomMarker({ value, onPress }) {
    return (
      <button data-testid="custom-marker" onClick={() => onPress ? onPress() : null} onKeyDown={(e) => e.key === 'Enter' && onPress ? onPress() : null}>
        <span>{value.id}</span>
      </button>
    );
  };
});

// Mock BuildingHighlight
jest.mock("../components/map-screen-ui/elements/BuildingHighlight", () => {
  return function MockBuildingHighlight() {
    return (
      <div data-testid="building-highlight"></div>
    );
  };
});

describe("MapViewComponent", () => {
  const mockMaxBounds = {
    northeast: {
      latitude: 46.0,
      longitude: -73.0,
    },
    southwest: {
      latitude: 45.0,
      longitude: -74.0,
    },
  };

  const mockRegion = {
    latitude: 45.5,
    longitude: -73.5,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const mockLocations = [
    {
      id: 1,
      name: "Location 1",
      building_code: "LOC1",
      campus: "SGW",
      civic_address: "1234 Test Street",
      parking_lot: true,
      accessibility: true,
      atm: false,
      location: {
        latitude: 45.49,
        longitude: -73.58,
      },
    },
    {
      id: 2,
      name: "Location 2",
      building_code: "LOC2",
      campus: "LOY",
      civic_address: "5678 Test Avenue",
      parking_lot: false,
      accessibility: false,
      atm: true,
      location: {
        latitude: 45.51,
        longitude: -73.52,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    locationService.getCurrentLocation.mockImplementation(() => ({
      coords: {
        latitude: 45.5,
        longitude: -73.6,
      }
    }));
  });

  it("should start tracking location on mount", () => {
    render(
      <NavigationContainer>
        <MapViewComponent
          locations={[]}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );
    expect(locationService.startTrackingLocation).toHaveBeenCalled();
  });

  it("should stop tracking location on unmount", () => {
    const { unmount } = render(
      <NavigationContainer>
        <MapViewComponent
          locations={mockLocations}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );
    unmount();
    expect(locationService.stopTrackingLocation).toHaveBeenCalled();
  });

  it("should handle error when fetching current location", async () => {
    // Mock location service to throw an error
    locationService.startTrackingLocation = jest
      .fn()
      .mockRejectedValue(new Error("Location error"));
    locationService.getCurrentLocation = jest.fn().mockReturnValue(null);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(
      <NavigationContainer>
        <MapViewComponent
          locations={mockLocations}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching location:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("should show loading indicator when locations array is empty", () => {
    const { getByText } = render(
      <NavigationContainer>
        <MapViewComponent
          locations={[]}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );

    expect(getByText("Loading locations...")).toBeTruthy();
  });

  it("should not show loading indicator when locations are loaded", () => {
    const { queryByText } = render(
      <NavigationContainer>
        <MapViewComponent
          locations={mockLocations}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );

    expect(queryByText("Loading locations...")).toBeNull();
  });

  it("should update region when target changes", () => {
    const mockTarget = {
      id: 3,
      name: "Target Location",
      building_code: "TGT",
      campus: "SGW",
      civic_address: "Target Street",
      location: {
        latitude: 45.52,
        longitude: -73.57,
      },
    };

    const { rerender } = render(
      <NavigationContainer>
        <MapViewComponent
          locations={mockLocations}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={{}}
        />
      </NavigationContainer>
    );

    rerender(
      <NavigationContainer>
        <MapViewComponent
          locations={mockLocations}
          region={mockRegion}
          maxBounds={mockMaxBounds}
          target={mockTarget}
        />
      </NavigationContainer>
    );
  });
});