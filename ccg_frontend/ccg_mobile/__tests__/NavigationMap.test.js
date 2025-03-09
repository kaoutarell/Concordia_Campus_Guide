import React from "react";
import { render } from "@testing-library/react-native";
import NavigationMap from "../components/navigation-screen-ui/sections/NavigationMap";

// Mock dependencies
jest.mock("react-native-maps", () => {
  const { View } = require("react-native");

  const MockMapView = props => {
    if (props.ref) {
      props.ref.current = {
        animateToRegion: jest.fn(),
      };
    }
    return (
      <View testID="mock-map-view" region={props.region}>
        {props.children}
      </View>
    );
  };

  MockMapView.Marker = props => <View testID="map-marker" {...props} />;
  MockMapView.Polyline = props => <View testID="map-polyline" {...props} />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMapView.Marker,
    Polyline: MockMapView.Polyline,
  };
});

// Setup mock for getMyCurrentLocation
const mockGetMyCurrentLocation = jest.fn().mockResolvedValue({
  location: {
    latitude: 45.495,
    longitude: -73.578,
  },
});

jest.mock("../utils/defaultLocations", () => ({
  getMyCurrentLocation: jest.fn().mockResolvedValue({
    location: {
      latitude: 45.495,
      longitude: -73.578,
    },
  }),
}));

// Mock bus marker and bus stop images
jest.mock("../assets/bus-marker.png", () => "bus-marker-image");
jest.mock("../assets/bus-stop.png", () => "bus-stop-image");

describe("NavigationMap Component", () => {
  const defaultProps = {
    start: {
      location: {
        latitude: 45.497,
        longitude: -73.579,
      },
      building_code: "H",
      campus: "SGW",
    },
    destination: {
      location: {
        latitude: 45.458,
        longitude: -73.64,
      },
      building_code: "CC",
      campus: "LOY",
    },
    bbox: [-73.65, 45.45, -73.57, 45.5], // [min_lng, min_lat, max_lng, max_lat]
    pathCoordinates: [
      {
        coordinates: [
          [-73.579, 45.497],
          [-73.58, 45.49],
          [-73.64, 45.458],
        ],
      },
    ],
    legs: null,
    isNavigating: false,
    displayShuttle: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with required props", () => {
    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...defaultProps} />);

    // Map should be rendered
    expect(getByTestId("mock-map-view")).toBeTruthy();

    // Start and end markers should be rendered
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBe(2); // Start and end markers

    // Route polyline should be rendered
    expect(queryAllByTestId("map-polyline").length).toBe(1);
  });

  it("renders correctly when in navigation mode", () => {
    const props = {
      ...defaultProps,
      isNavigating: true,
    };

    const { getByTestId } = render(<NavigationMap {...props} />);

    // Map should still be rendered in navigation mode
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("renders correctly with shuttle display enabled", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.579, 45.497],
                [-73.58, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
        1: {
          steps: [
            {
              coordinates: [
                [-73.59, 45.48],
                [-73.64, 45.458],
              ],
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...props} />);

    // Map should be rendered with shuttle display
    expect(getByTestId("mock-map-view")).toBeTruthy();

    // Should render bus stop markers in shuttle mode
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(2); // Start, end, and bus stops
  });

  it("handles shuttle mode with bus locations", () => {
    const shuttleLocations = [
      { id: 1, latitude: 45.5, longitude: -73.6 },
      { id: 2, latitude: 45.4, longitude: -73.65 },
    ];

    const props = {
      ...defaultProps,
      displayShuttle: true,
      shuttleLocations: shuttleLocations,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.579, 45.497],
                [-73.58, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
      },
    };

    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should render shuttle markers
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(2); // Start, end, bus stops, and shuttles

    // Check if any marker has bus marker image
    const busMarkers = markers.some(marker => marker.props.image === "bus-marker-image");
    expect(busMarkers).toBeTruthy();
  });

  it("calculates correct region from bbox", () => {
    const { getByTestId } = render(<NavigationMap {...defaultProps} />);

    const mapView = getByTestId("mock-map-view");

    // Verify the region props are calculated correctly from bbox
    expect(mapView.props.region).toEqual({
      latitude: (defaultProps.bbox[1] + defaultProps.bbox[3]) / 2,
      longitude: (defaultProps.bbox[0] + defaultProps.bbox[2]) / 2,
      latitudeDelta: Math.abs(defaultProps.bbox[3] - defaultProps.bbox[1]) * 1.2,
      longitudeDelta: Math.abs(defaultProps.bbox[2] - defaultProps.bbox[0]) * 1.2,
    });
  });

  it("handles case with no path coordinates", () => {
    const props = {
      ...defaultProps,
      pathCoordinates: null,
    };

    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...props} />);

    // Map should still render
    expect(getByTestId("mock-map-view")).toBeTruthy();

    // Polyline should still render with empty coordinates
    const polylines = queryAllByTestId("map-polyline");
    expect(polylines.length).toBe(1);
    expect(polylines[0].props.coordinates).toEqual([]);
  });

  it("handles case with empty legs", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {},
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("handles different start/end title formats for shuttle mode", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      start: {
        location: {
          latitude: 45.497,
          longitude: -73.579,
        },
        campus: "SGW",
        // No building_code
      },
      destination: {
        location: {
          latitude: 45.458,
          longitude: -73.64,
        },
        // No campus or building_code
      },
    };

    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...props} />);

    // Map markers should still have titles
    const markers = queryAllByTestId("map-marker");

    // First marker should have campus as title
    expect(markers[0].props.title).toBe("SGW");

    // Second marker should have "End" as title
    expect(markers[1].props.title).toBe("End");
  });

  it("renders with complete bus stops from legs when shuttle mode is on", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.58, 45.496],
                [-73.585, 45.49],
                [-73.59, 45.48],
              ],
            },
          ],
          total_distance: 500,
        },
        1: {
          steps: [
            {
              coordinates: [
                [-73.61, 45.47],
                [-73.62, 45.465],
                [-73.63, 45.46],
              ],
            },
          ],
          total_distance: 500,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should render bus stop markers
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(2); // Start, end, and bus stops

    // Some markers should have the bus stop image
    const busStopMarkers = markers.some(marker => marker.props.image === "bus-stop-image");
    expect(busStopMarkers).toBeTruthy();
  });

  it("renders without legs with total_distance of 0", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.579, 45.497],
                [-73.58, 45.49],
              ],
            },
          ],
          total_distance: 0, // This leg should be filtered out
        },
      },
    };

    const { getByTestId, queryAllByTestId } = render(<NavigationMap {...props} />);

    // Legs with distance 0 should be filtered out
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBe(2); // Only start and end markers, no bus stops
  });

  it("handles empty coordinate arrays in legs steps", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              // Empty coordinates array
              coordinates: [],
            },
          ],
          total_distance: 100,
        },
      },
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("handles BusTrackingMarkers with shuttle locations", () => {
    const shuttleLocations = [
      { id: "bus1", latitude: 45.49, longitude: -73.58 },
      { id: "bus2", latitude: 45.48, longitude: -73.59 },
    ];

    const props = {
      ...defaultProps,
      displayShuttle: true,
      shuttleLocations: shuttleLocations,
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should have markers with bus marker image
    const markers = queryAllByTestId("map-marker");
    const busMarkers = markers.filter(marker => marker.props.image === "bus-marker-image");
    expect(busMarkers.length).toBe(2);
  });

  it("does not display bus markers when displayShuttle is false", () => {
    const shuttleLocations = [{ id: "bus1", latitude: 45.49, longitude: -73.58 }];

    const props = {
      ...defaultProps,
      displayShuttle: false,
      shuttleLocations: shuttleLocations,
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should not have markers with bus marker image
    const markers = queryAllByTestId("map-marker");
    const busMarkers = markers.filter(marker => marker.props.image === "bus-marker-image");
    expect(busMarkers.length).toBe(0);
  });

  it("handles case when shuttle locations are missing", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      shuttleLocations: null,
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should not have markers with bus marker image
    const markers = queryAllByTestId("map-marker");
    const busMarkers = markers.filter(marker => marker.props.image === "bus-marker-image");
    expect(busMarkers.length).toBe(0);
  });

  it("handles different id types for shuttle locations", () => {
    const shuttleLocations = [
      { id: "string-id", latitude: 45.49, longitude: -73.58 },
      { id: 123, latitude: 45.48, longitude: -73.59 },
    ];

    const props = {
      ...defaultProps,
      displayShuttle: true,
      shuttleLocations: shuttleLocations,
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);

    // Should have markers with bus marker image
    const markers = queryAllByTestId("map-marker");
    const busMarkers = markers.filter(marker => marker.props.image === "bus-marker-image");
    expect(busMarkers.length).toBe(2);
  });

  // Testing useEffect to cover the uncovered lines in isNavigating/start location code
  it("tests the useEffect code for isNavigating", () => {
    jest.spyOn(React, "useEffect").mockImplementationOnce(f => f());

    // Create a mock animateToRegion function
    const mockAnimateToRegion = jest.fn();

    // Create a mock ref for the map
    const mockMapRef = {
      current: {
        animateToRegion: mockAnimateToRegion,
      },
    };

    // Mock useRef to return our mock ref
    jest.spyOn(React, "useRef").mockReturnValueOnce(mockMapRef);

    // Test that useEffect handles isNavigating with start location
    render(<NavigationMap {...defaultProps} isNavigating={true} />);

    // The code that gets the current location should NOT have been called
    expect(jest.requireMock("../utils/defaultLocations").getMyCurrentLocation).not.toHaveBeenCalled();
  });

  it("tests useEffect when in navigation mode without start location", () => {
    // Mock getMyCurrentLocation for this test
    const { getMyCurrentLocation } = jest.requireMock("../utils/defaultLocations");

    // Setup a fresh mock for this test
    getMyCurrentLocation.mockClear();

    // Create props without start location
    const propsWithoutStartLocation = {
      ...defaultProps,
      isNavigating: true,
      start: {
        // start.location is undefined
      },
    };

    render(<NavigationMap {...propsWithoutStartLocation} />);

    // The useEffect hook should call getMyCurrentLocation for the fallback
    expect(getMyCurrentLocation).toHaveBeenCalled();
  });

  it("handles legs with steps that don't have coordinates", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              // Step without coordinates property
            },
          ],
          total_distance: 100,
        },
      },
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("handles firstLeg without steps", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          // No steps array
          total_distance: 100,
        },
        1: {
          steps: [
            {
              coordinates: [
                [-73.61, 45.47],
                [-73.62, 45.465],
              ],
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles lastLeg without steps", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.58, 45.496],
                [-73.585, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
        1: {
          // No steps array
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles start with no building_code or campus", () => {
    const props = {
      ...defaultProps,
      start: {
        location: {
          latitude: 45.497,
          longitude: -73.579,
        },
        // No building_code or campus
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    // First marker should have undefined title since no building_code or campus
    expect(markers[0].props.title).toBe(undefined);
  });

  it("handles leg steps with coordinates but without coordinates array", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: "not-an-array", // Not an array
            },
          ],
          total_distance: 100,
        },
      },
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("handles firstLeg with empty steps", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [], // Empty steps array
          total_distance: 100,
        },
        1: {
          steps: [
            {
              coordinates: [
                [-73.61, 45.47],
                [-73.62, 45.465],
              ],
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles lastLeg with empty steps", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.58, 45.496],
                [-73.585, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
        1: {
          steps: [], // Empty steps array
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles firstLeg with steps that have no coordinates", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              // No coordinates
            },
          ],
          total_distance: 100,
        },
        1: {
          steps: [
            {
              coordinates: [
                [-73.61, 45.47],
                [-73.62, 45.465],
              ],
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles lastLeg with steps that have no coordinates", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.58, 45.496],
                [-73.585, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
        1: {
          steps: [
            {
              // No coordinates
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("handles firstLeg with steps that have empty coordinates", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [], // Empty coordinates array
            },
          ],
          total_distance: 100,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    expect(markers.length).toBe(2); // Only start and end markers
  });

  it("handles lastLeg with steps that have empty coordinates", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      legs: {
        0: {
          steps: [
            {
              coordinates: [
                [-73.58, 45.496],
                [-73.585, 45.49],
              ],
            },
          ],
          total_distance: 100,
        },
        1: {
          steps: [
            {
              coordinates: [], // Empty coordinates array
            },
          ],
          total_distance: 200,
        },
      },
    };

    const { queryAllByTestId } = render(<NavigationMap {...props} />);
    const markers = queryAllByTestId("map-marker");
    // Should at least have start, end markers, and bus stop from first leg
    expect(markers.length).toBeGreaterThan(2);
  });
});
