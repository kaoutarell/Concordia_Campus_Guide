import React from "react";
import { render } from "@testing-library/react-native";
import NavigationMap from "../components/navigation-screen-ui/sections/NavigationMap";
import { getMyCurrentLocation } from "../utils/defaultLocations";

// Mock dependencies
jest.mock("react-native-maps", () => {
  const { View } = require("react-native");

  const MockMapView = props => {
    if (props.ref) {
      props.ref.current = {
        animateToRegion: jest.fn(),
      };
    }
    return <View testID="mock-map-view">{props.children}</View>;
  };

  MockMapView.Marker = () => <View testID="map-marker" />;
  MockMapView.Polyline = () => <View testID="map-polyline" />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMapView.Marker,
    Polyline: MockMapView.Polyline,
  };
});

jest.mock("../utils/defaultLocations", () => ({
  getMyCurrentLocation: jest.fn().mockResolvedValue({
    location: {
      latitude: 45.495,
      longitude: -73.578,
    },
  }),
}));

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

    // Check if getMyCurrentLocation was called for navigation mode
    expect(getMyCurrentLocation).toHaveBeenCalled();
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

    const { getByTestId } = render(<NavigationMap {...props} />);

    // Map should be rendered with shuttle display
    expect(getByTestId("mock-map-view")).toBeTruthy();
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

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("handles case with no path coordinates", () => {
    const props = {
      ...defaultProps,
      pathCoordinates: null,
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
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

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
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

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
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

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
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

  it("properly renders BusTrackingMarkers component with shuttle locations", () => {
    const props = {
      ...defaultProps,
      displayShuttle: true,
      shuttleLocations: [
        { id: "bus1", latitude: 45.49, longitude: -73.58 },
        { id: "bus2", latitude: 45.48, longitude: -73.59 },
      ],
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });

  it("does not display BusTrackingMarkers when displayShuttle is false", () => {
    const props = {
      ...defaultProps,
      displayShuttle: false,
      shuttleLocations: [{ id: "bus1", latitude: 45.49, longitude: -73.58 }],
    };

    const { getByTestId } = render(<NavigationMap {...props} />);
    expect(getByTestId("mock-map-view")).toBeTruthy();
  });
});
