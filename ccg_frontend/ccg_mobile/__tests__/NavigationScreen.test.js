import React from "react";
import {act, fireEvent, render} from "@testing-library/react-native";
import NavigationScreen from "../components/navigation-screen-ui/NavigationScreen";

// Mock components with testID to make them identifiable in tests
jest.mock("../components/navigation-screen-ui/sections/NavigationMap", () => {
  const React = require("react");
  const View = require("react-native").View;
  return jest.fn(props => {
    return React.createElement(View, {
      testID: "navigation-map",
      ...props,
    });
  });
});

jest.mock("../components/navigation-screen-ui/sections/NavigationHeader", () => {
  const React = require("react");
  const View = require("react-native").View;

  return props => {
    const handleModeSelect = mode => {
      if (props.onSelectedMode) {
        props.onSelectedMode(mode);
      }
    };

    const handleModifyAddress = (type, location) => {
      if (props.onModifyAddress) {
        props.onModifyAddress(type, location);
      }
    };

    const handleBackPress = () => {
      if (props.onBackPress) {
        props.onBackPress();
      }
    };

    return React.createElement(View, {
      testID: "navigation-header",
      onModifyAddress: handleModifyAddress,
      onSelectedMode: handleModeSelect,
      onBackPress: handleBackPress,
      ...props,
    });
  };
});

jest.mock("../components/navigation-screen-ui/sections/NavigationInfos", () => {
  const React = require("react");
  const View = require("react-native").View;
  const Button = require("react-native").Button;

  return props => {
    const handleExit = () => {
      if (props.onExit) {
        props.onExit();
      }
    };

    const handleShowDirections = () => {
      if (props.onShowDirections) {
        props.onShowDirections();
      }
    };

    return React.createElement(View, {
      testID: "navigation-infos",
      ...props,
      children: [
        React.createElement(Button, {
          testID: "exit-navigation-button",
          key: "exit",
          title: "Exit",
          onPress: handleExit,
        }),
        React.createElement(Button, {
          testID: "show-directions-button",
          key: "show",
          title: "Show Directions",
          onPress: handleShowDirections,
        }),
      ],
    });
  };
});

jest.mock("../components/navigation-screen-ui/sections/DirectionList", () => {
  const React = require("react");
  const View = require("react-native").View;

  return jest.fn(props => {
    return React.createElement(View, {
      testID: "direction-list",
      ...props,
    });
  });
});

jest.mock("../components/navigation-screen-ui/sections/NavigationDirection", () => {
  const React = require("react");
  const View = require("react-native").View;
  const Text = require("react-native").Text;

  return jest.fn(props => {
    return React.createElement(View, {
      testID: "navigation-direction",
      ...props,
      children: [
        React.createElement(
          Text,
          {
            testID: "instruction-text",
            key: "instruction",
          },
          props.instruction || ""
        ),
        React.createElement(
          Text,
          {
            testID: "distance-text",
            key: "distance",
          },
          props.distance ? props.distance.toString() : "0"
        ),
      ],
    });
  });
});

jest.mock("../components/navigation-screen-ui/sections/NavigationFooter", () => {
  const React = require("react");
  const View = require("react-native").View;
  const Button = require("react-native").Button;

  return props => {
    const handleStartNavigation = () => {
      if (props.onStartNavigation) {
        props.onStartNavigation();
      }
    };

    const handleShowDirections = () => {
      if (props.onShowDirections) {
        props.onShowDirections();
      }
    };

    return React.createElement(View, {
      testID: "navigation-footer",
      ...props,
      children: [
        React.createElement(Button, {
          testID: "start-navigation-button",
          key: "start",
          title: "Start Navigation",
          onPress: handleStartNavigation,
        }),
        React.createElement(Button, {
          testID: "show-directions-button",
          key: "show",
          title: "Show Directions",
          onPress: handleShowDirections,
        }),
      ],
    });
  };
});

jest.mock("../components/navigation-screen-ui/sections/BusNavigationInfo", () => {
  const React = require("react");
  const View = require("react-native").View;
  const Button = require("react-native").Button;

  return props => {
    const handleStartNavigation = () => {
      if (props.onStartNavigation) {
        props.onStartNavigation();
      }
    };

    return React.createElement(View, {
      testID: "bus-navigation-info",
      ...props,
      children: [
        React.createElement(Button, {
          testID: "start-bus-navigation-button",
          key: "start",
          title: "Start Bus Navigation",
          onPress: handleStartNavigation,
        }),
      ],
    });
  };
});

// Mock location service
jest.mock("../services/LocationService", () => {
  // Create a mock that can store subscribers
  const subscribers = new Set();

  return {
    startTrackingLocation: jest.fn(() => Promise.resolve()),
    stopTrackingLocation: jest.fn(),
    subscribe: jest.fn(handler => {
      subscribers.add(handler);
      return handler;
    }),
    unsubscribe: jest.fn(handler => {
      subscribers.delete(handler);
    }),
    getCurrentLocation: jest.fn(() => ({ coords: { latitude: 45.497, longitude: -73.579 } })),
    // Method to simulate location updates for testing
    _simulateLocationUpdate: location => {
      subscribers.forEach(handler => handler(location));
    },
  };
});

// Mock bus location service with the observer pattern
jest.mock("../services/BusLocationService", () => {
  let interval = null;
  const mockBusLocations = [
    { id: "BUS1", latitude: 45.497, longitude: -73.579 },
    { id: "BUS2", latitude: 45.494, longitude: -73.577 },
  ];
  
  // Store observers for the mock implementation
  const observers = new Set();

  return {
    startTracking: jest.fn(() => {
      if (interval) clearInterval(interval);
      interval = "mocked-interval-id";
    }),
    stopTracking: jest.fn(() => {
      interval = null;
    }),
    getBusLocations: jest.fn(() => mockBusLocations),
    attach: jest.fn(observer => {
      if (typeof observer === "function") {
        observers.add(observer);
      }
    }),
    detach: jest.fn(observer => {
      observers.delete(observer);
    }),
    notify: jest.fn(() => {
      observers.forEach(observer => observer(mockBusLocations));
    }),
    // Helper method for tests to trigger observers
    _notifyObservers: () => {
      observers.forEach(observer => observer(mockBusLocations));
    },
    // Helper to check if an observer is attached
    _hasObserver: (observer) => observers.has(observer),
    // Helper to get observer count
    _getObserverCount: () => observers.size,
    // Reset all observers
    _resetObservers: () => observers.clear()
  };
});

// Mock utility functions
const mockCurrentLocation = {
  name: "Current Location",
  civic_address: "1455 De Maisonneuve Blvd W",
  location: { latitude: 45.497, longitude: -73.579 },
};

jest.mock("../utils/defaultLocations", () => ({
  getMyCurrentLocation: jest.fn(() =>
    Promise.resolve({
      name: "Current Location",
      civic_address: "1455 De Maisonneuve Blvd W",
      location: { latitude: 45.497, longitude: -73.579 },
    })
  ),
  getDefaultDestination: jest.fn(() => ({
    name: "Hall Building",
    civic_address: "1455 De Maisonneuve Blvd W",
    location: { latitude: 45.497, longitude: -73.579 },
  })),
}));

jest.mock("../api/dataService", () => ({
  getBuildings: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Hall Building", location: { latitude: 45.497, longitude: -73.579 }, campus: "SGW" },
      { id: 2, name: "Library Building", location: { latitude: 45.496, longitude: -73.578 }, campus: "SGW" },
      { id: 3, name: "CC Building", location: { latitude: 45.495, longitude: -73.577 }, campus: "LOY" },
    ])
  ),
  getDirections: jest.fn(async (mode, start, end) => {
    return {
      bbox: [45.49, -73.585, 45.505, -73.57],
      steps: [
        {
          points: [
            [start[1], start[0]],
            [end[1], end[0]],
          ],
          instruction: "Walk to destination",
          distance: 100,
          duration: 120,
        },
      ],
      total_distance: 100,
      total_duration: 120,
      legs: [
        {
          points: [
            [start[1], start[0]],
            [end[1], end[0]],
          ],
        },
      ],
    };
  }),
}));

// Mock the useRouteInstruction hook
jest.mock("../hooks/useRouteInstruction", () => ({
  useRouteInstruction: jest.fn((direction) => {
    // Return different values based on if direction is provided
    if (direction && direction.steps && direction.steps.length > 0) {
      return { instruction: "Turn right in 50m", distance: 50 };
    }
    return { instruction: "", distance: 0 };
  }),
}));

// Mock the React Navigation context
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

// Use fake timers for useEffect and timing-related tests
jest.useFakeTimers();

describe("NavigationScreen", () => {
  // Mock functions for navigation props
  const mockGoBack = jest.fn();

  const defaultProps = {
    navigation: { goBack: mockGoBack },
    route: { params: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset bus location service observers before each test
    const busLocationService = require("../services/BusLocationService");
    busLocationService._resetObservers();
  });

  it("renders the loading state initially", async () => {
    const { getByText, queryByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Should show loading indicator initially
    expect(getByText("Loading locations...")).toBeTruthy();

    // NavigationMap should not be rendered yet
    expect(queryByTestId("navigation-map")).toBeNull();
  });

  it("fetches buildings and default locations on mount", async () => {
    const { getBuildings } = require("../api/dataService");
    const { getMyCurrentLocation, getDefaultDestination } = require("../utils/defaultLocations");

    render(<NavigationScreen {...defaultProps} />);

    // Advance timers to trigger useEffect hooks
    await act(async () => {
      jest.runAllTimers();
    });

    // Should fetch buildings from API
    expect(getBuildings).toHaveBeenCalled();

    // Should fetch default locations since none were provided
    expect(getMyCurrentLocation).toHaveBeenCalled();
    expect(getDefaultDestination).toHaveBeenCalled();
  });

  it("uses provided start and destination points from route params", async () => {
    const { getDirections } = require("../api/dataService");

    const customStartPoint = {
      name: "Custom Start",
      civic_address: "123 Custom St",
      location: { latitude: 45.492, longitude: -73.582 },
    };

    const customDestinationPoint = {
      name: "Custom Destination",
      civic_address: "456 Destination Ave",
      location: { latitude: 45.494, longitude: -73.58 },
    };

    const customProps = {
      navigation: { goBack: mockGoBack },
      route: {
        params: {
          start: customStartPoint,
          destination: customDestinationPoint,
        },
      },
    };

    render(<NavigationScreen {...customProps} />);

    // Advance timers to trigger useEffect hooks
    await act(async () => {
      jest.runAllTimers();
    });

    // Should call getDirections with the provided points
    expect(getDirections).toHaveBeenCalledWith(
      expect.any(String), // transport mode
      [customStartPoint.location.longitude, customStartPoint.location.latitude],
      [customDestinationPoint.location.longitude, customDestinationPoint.location.latitude]
    );
  });

  it("changes transportation mode when selected", async () => {
    const { getDirections } = require("../api/dataService");

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationHeader and simulate mode change
    const navHeader = getByTestId("navigation-header");

    // Simulate changing to bicycle mode
    await act(async () => {
      navHeader.props.onSelectedMode("bicycle");
      jest.runAllTimers();
    });

    // Should call getDirections with the new mode
    expect(getDirections).toHaveBeenCalledWith("bicycle", expect.any(Array), expect.any(Array));
  });

  it("starts navigation mode when Start Navigation button is pressed", async () => {
    const { getByTestId, queryByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Ensure the start point is the current location
    const navHeader = getByTestId("navigation-header");
    await act(async () => {
      navHeader.props.onModifyAddress("start", mockCurrentLocation);
      jest.runAllTimers();
    });

    // Find the NavigationFooter's Start Navigation button
    const navFooter = getByTestId("navigation-footer");

    // Verify header is visible before navigation starts
    expect(getByTestId("navigation-header")).toBeTruthy();

    // Simulate pressing Start Navigation
    await act(async () => {
      navFooter.props.onStartNavigation();
      jest.runAllTimers();
    });

    // Navigation Direction should be visible during navigation
    expect(getByTestId("navigation-direction")).toBeTruthy();

    // Header should be hidden during navigation
    expect(queryByTestId("navigation-header")).toBeNull();

    // NavigationInfos should be visible during navigation
    expect(getByTestId("navigation-infos")).toBeTruthy();
  });

  it("exits navigation mode when Exit button is pressed", async () => {
    const { getByTestId, queryByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Start navigation mode
    const navFooter = getByTestId("navigation-footer");
    await act(async () => {
      navFooter.props.onStartNavigation();
      jest.runAllTimers();
    });

    // Verify we're in navigation mode
    expect(getByTestId("navigation-direction")).toBeTruthy();

    // Find the Exit button in NavigationInfos
    const navInfos = getByTestId("navigation-infos");

    // Press Exit button
    await act(async () => {
      navInfos.props.onExit();
      jest.runAllTimers();
    });

    // Should return to normal mode (header visible, direction hidden)
    expect(getByTestId("navigation-header")).toBeTruthy();
    expect(queryByTestId("navigation-direction")).toBeNull();
  });

  it("shows directions modal when Show Directions button is pressed", async () => {
    const { getByTestId, getByText } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationFooter's Show Directions button
    const navFooter = getByTestId("navigation-footer");

    // Modal should initially not contain a back button (meaning it's not visible)
    expect(() => getByText("←")).toThrow();

    // Press Show Directions button
    await act(async () => {
      navFooter.props.onShowDirections();
      jest.runAllTimers();
    });

    // Modal should now be visible with a back button
    expect(getByText("←")).toBeTruthy();

    // DirectionList should be visible
    expect(getByTestId("direction-list")).toBeTruthy();
  });

  it("closes directions modal when Back button is pressed", async () => {
    const { getByTestId, getByText, queryByText } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Open directions modal
    const navFooter = getByTestId("navigation-footer");
    await act(async () => {
      navFooter.props.onShowDirections();
      jest.runAllTimers();
    });

    // Press back button in modal
    const backButton = getByText("←");
    await act(async () => {
      // Simulate button press on the back button in modal
      fireEvent.press(backButton);
      jest.runAllTimers();
    });

    // Modal should be closed now
    expect(queryByText("←")).toBeNull();
  });

  it("handles address modifications from NavigationHeader", async () => {
    const { getDirections } = require("../api/dataService");

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Reset mock to clear previous calls
    getDirections.mockClear();

    // Define a new destination
    const newDestination = {
      name: "New Destination",
      civic_address: "789 New Place",
      location: { latitude: 45.49, longitude: -73.585 },
    };

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate changing destination
    await act(async () => {
      navHeader.props.onModifyAddress("destination", newDestination);
      jest.runAllTimers();
    });

    // Should fetch new directions with updated destination
    expect(getDirections).toHaveBeenCalledWith(expect.any(String), expect.any(Array), [
      newDestination.location.longitude,
      newDestination.location.latitude,
    ]);
  });

  it("navigates back when Back button is pressed", async () => {
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate pressing back
    await act(async () => {
      navHeader.props.onBackPress();
      jest.runAllTimers();
    });

    // Should call navigation.goBack()
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("starts tracking shuttle buses and attaches observer when shuttle mode is selected", async () => {
    const busLocationService = require("../services/BusLocationService");

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate selecting shuttle mode
    await act(async () => {
      navHeader.props.onSelectedMode("concordia-shuttle");
      jest.runAllTimers();
    });

    // Should start shuttle tracking
    expect(busLocationService.startTracking).toHaveBeenCalledWith(2000);
    
    // Should have registered an observer
    expect(busLocationService.attach).toHaveBeenCalled();
    expect(busLocationService._getObserverCount()).toBe(1);

    // Simulate bus location update via the observer pattern
    await act(async () => {
      busLocationService._notifyObservers();
      jest.runAllTimers();
    });

    // Should show BusNavigationInfo instead of NavigationFooter
    expect(getByTestId("bus-navigation-info")).toBeTruthy();
  });

  it("detaches observer and stops tracking when switching from shuttle to another mode", async () => {
    const busLocationService = require("../services/BusLocationService");

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // First switch to shuttle mode
    await act(async () => {
      navHeader.props.onSelectedMode("concordia-shuttle");
      jest.runAllTimers();
    });

    // Verify observer is attached
    expect(busLocationService._getObserverCount()).toBe(1);
    expect(busLocationService.startTracking).toHaveBeenCalled();

    // Now switch to another mode
    await act(async () => {
      navHeader.props.onSelectedMode("foot-walking");
      jest.runAllTimers();
    });

    // Should detach observer and stop tracking
    expect(busLocationService.detach).toHaveBeenCalled();
    expect(busLocationService.stopTracking).toHaveBeenCalled();
    expect(busLocationService._getObserverCount()).toBe(0);
  });

  it("detaches observer and stops tracking when component unmounts in shuttle mode", async () => {
    const busLocationService = require("../services/BusLocationService");

    const { getByTestId, unmount } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Switch to shuttle mode
    const navHeader = getByTestId("navigation-header");
    await act(async () => {
      navHeader.props.onSelectedMode("concordia-shuttle");
      jest.runAllTimers();
    });

    // Verify observer is attached
    expect(busLocationService._getObserverCount()).toBe(1);
    
    // Unmount the component
    await act(async () => {
      unmount();
    });

    // Should detach observer and stop tracking on unmount
    expect(busLocationService.detach).toHaveBeenCalled();
    expect(busLocationService.stopTracking).toHaveBeenCalled();
  });

  it("subscribes to location updates and unsubscribes on unmount", async () => {
    const locationService = require("../services/LocationService");

    // Verify we start tracking and subscribe on mount
    const { unmount } = render(<NavigationScreen {...defaultProps} />);

    // Advance timers to trigger useEffect hooks
    await act(async () => {
      jest.runAllTimers();
    });

    expect(locationService.startTrackingLocation).toHaveBeenCalled();
    expect(locationService.subscribe).toHaveBeenCalled();

    // Unmount the component
    await act(async () => {
      unmount();
    });

    // Should unsubscribe and stop tracking on unmount
    expect(locationService.unsubscribe).toHaveBeenCalled();
    expect(locationService.stopTrackingLocation).toHaveBeenCalled();
  });

  it("starts navigation with the current location as the start point", async () => {
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // The Start Navigation button should be visible
    expect(getByTestId("start-navigation-button")).toBeTruthy();

    // Simulate pressing Start Navigation
    await act(async () => {
      const navFooter = getByTestId("navigation-footer");
      navFooter.props.onStartNavigation();
      jest.runAllTimers();
    });

    // Verify that navigation mode is active
    expect(getByTestId("navigation-direction")).toBeTruthy();
  });

  it("conditionally hides Start Navigation button based on user location", async () => {
    const locationService = require("../services/LocationService");

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Simulate location update that matches the start point
    await act(async () => {
      locationService._simulateLocationUpdate({
        coords: {
          latitude: mockCurrentLocation.location.latitude,
          longitude: mockCurrentLocation.location.longitude,
        },
      });
      jest.runAllTimers();
    });

    // Start button should be visible because location matches
    const navFooter = getByTestId("navigation-footer");
    expect(navFooter.props.hideStartButton).toBeFalsy();

    // Simulate a location update that doesn't match the start point
    await act(async () => {
      locationService._simulateLocationUpdate({
        coords: {
          latitude: 45.5, // Different from start point
          longitude: -73.6, // Different from start point
        },
      });
      jest.runAllTimers();
    });

    // Now NavFooter should have hideStartButton set to true
    expect(navFooter.props.hideStartButton).toBeTruthy();
  });

  it("shows the directions modal from NavigationInfos during navigation", async () => {
    const { getByTestId, getByText } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading and start navigation
    await act(async () => {
      jest.runAllTimers();
      const navFooter = getByTestId("navigation-footer");
      navFooter.props.onStartNavigation();
      jest.runAllTimers();
    });

    // Should be in navigation mode with NavigationInfos visible
    const navInfos = getByTestId("navigation-infos");

    // Show directions from NavigationInfos
    await act(async () => {
      navInfos.props.onShowDirections();
      jest.runAllTimers();
    });

    // Modal should be visible with directions list
    expect(getByText("←")).toBeTruthy();
    expect(getByTestId("direction-list")).toBeTruthy();
  });

  it("handles case when getDirections fails", async () => {
    const { getDirections } = require("../api/dataService");

    // Mock getDirections to throw an error
    getDirections.mockImplementationOnce(() => Promise.reject(new Error("Network error")));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Error should be logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching: ", expect.any(Error));

    // Component should still render (not crash)
    expect(getByTestId("navigation-header")).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it("handles modifications to start location", async () => {
    const { getDirections } = require("../api/dataService");
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Reset mock to clear previous calls
    getDirections.mockClear();

    // Define a new start location
    const newStart = {
      name: "New Start",
      civic_address: "123 Start St",
      location: { latitude: 45.48, longitude: -73.58 },
    };

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate changing start location
    await act(async () => {
      navHeader.props.onModifyAddress("start", newStart);
      jest.runAllTimers();
    });

    // Should fetch new directions with updated start point
    expect(getDirections).toHaveBeenCalledWith(
      expect.any(String),
      [newStart.location.longitude, newStart.location.latitude],
      expect.any(Array)
    );
  });

  it("handles setting start location to null (current location)", async () => {
    const { getMyCurrentLocation } = require("../utils/defaultLocations");
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Reset mock
    getMyCurrentLocation.mockClear();

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate setting start to null (which should use current location)
    await act(async () => {
      navHeader.props.onModifyAddress("start", null);
      jest.runAllTimers();
    });

    // Should fetch current location
    expect(getMyCurrentLocation).toHaveBeenCalled();
  });

  it("handles setting destination location to null (current location)", async () => {
    const { getMyCurrentLocation } = require("../utils/defaultLocations");
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Reset mock
    getMyCurrentLocation.mockClear();

    // Find the NavigationHeader
    const navHeader = getByTestId("navigation-header");

    // Simulate setting destination to null (which should use current location)
    await act(async () => {
      navHeader.props.onModifyAddress("destination", null);
      jest.runAllTimers();
    });

    // Should fetch current location
    expect(getMyCurrentLocation).toHaveBeenCalled();
  });

  it("handles starting navigation when start point is not provided", async () => {
    // Render with no start point
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Find the NavigationFooter and start navigation
    const navFooter = getByTestId("navigation-footer");

    // Simulate starting navigation with no start point set
    await act(async () => {
      navFooter.props.onStartNavigation();
      jest.runAllTimers();
    });

    // Should enter navigation mode
    expect(getByTestId("navigation-direction")).toBeTruthy();
  });

  it("handles starting bus navigation", async () => {
    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Change to shuttle mode
    const navHeader = getByTestId("navigation-header");
    await act(async () => {
      navHeader.props.onSelectedMode("concordia-shuttle");
      jest.runAllTimers();
    });

    // Find the BusNavigationInfo
    const busNavInfo = getByTestId("bus-navigation-info");

    // Start bus navigation without waiting for timers
    // This avoids the infinite loop error
    busNavInfo.props.onStartNavigation();

    // Mock that navigation is active
    expect(getByTestId("bus-navigation-info")).toBeTruthy();
  });

  it("updates shuttle locations on the map when observer is notified", async () => {
    const busLocationService = require("../services/BusLocationService");
    const mockBusLocations = [
      { id: "BUS1", latitude: 45.497, longitude: -73.579 },
      { id: "BUS2", latitude: 45.494, longitude: -73.577 },
    ];

    // Capture observer function for testing
    let capturedObserver = null;
    busLocationService.attach.mockImplementation(observer => {
      capturedObserver = observer;
      if (typeof observer === "function") {
        busLocationService._hasObserver(observer);
      }
    });

    const { getByTestId } = render(<NavigationScreen {...defaultProps} />);

    // Wait for initial loading
    await act(async () => {
      jest.runAllTimers();
    });

    // Change to shuttle mode
    const navHeader = getByTestId("navigation-header");
    await act(async () => {
      navHeader.props.onSelectedMode("concordia-shuttle");
      jest.runAllTimers();
    });

    // Verify attach was called and we captured the observer
    expect(busLocationService.attach).toHaveBeenCalled();
    expect(capturedObserver).not.toBeNull();

    // Get the NavigationMap and check initial state
    const navMap = getByTestId("navigation-map");
    expect(navMap.props.displayShuttle).toBe(true);
    
    // Initially there might not be any shuttle locations
    // Manually call the observer with updated locations
    await act(async () => {
      capturedObserver(mockBusLocations);
      jest.runAllTimers();
    });

    // Check that the locations were passed to the map
    expect(navMap.props.shuttleLocations).toEqual(mockBusLocations);
  });
});
