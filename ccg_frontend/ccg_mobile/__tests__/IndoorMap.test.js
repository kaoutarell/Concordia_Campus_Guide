import React from "react";
import { render } from "@testing-library/react-native";
import IndoorMap from "../components/indoor-navigation-ui/sections/IndoorMap";
import { useNavigation } from "@react-navigation/native";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons", // or any other icon set you're using
}));

// Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// Mock @openspacelabs/react-native-zoomable-view
jest.mock("@openspacelabs/react-native-zoomable-view", () => ({
  ReactNativeZoomableView: ({ children }) => <>{children}</>,
}));

// Mock useNavigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

const path = {
  floor_sequence: ["H8", "Outside"],
  path_data: { H8: "M160 200 L180 220 L180 220 L555 220 L555 800 L675 800 L675 820" },
  pin: {
    H8: [
      [75, 105],
      [640, 900],
    ],
  },
};

describe("IndoorMap Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<IndoorMap path={path} index={0} />);
    expect(getByText("ReactNativeZoomableView")).toBeTruthy();
  });

  it("displays the start pin when coordinates are provided", () => {
    const { getByTestId } = render(<IndoorMap path={path} index={0} />);
    expect(getByTestId("start-pin")).toBeTruthy();
  });

  it("displays the destination pin when coordinates are provided", () => {
    const { getByTestId } = render(<IndoorMap path={path} index={0} />);
    expect(getByTestId("destination-pin")).toBeTruthy();
  });

  it("renders the path when path_data is provided", () => {
    const { getByTestId } = render(<IndoorMap path={path} index={0} />);
    expect(getByTestId("path-svg")).toBeTruthy();
  });

  it("renders title when path is provided", () => {
    const { getByTestId } = render(<IndoorMap path={path} index={0} />);
    expect(getByTestId("title")).toBeTruthy();
  });

  it("renders default title when no path is provided", () => {
    const { getByTestId } = render(<IndoorMap path={null} index={0} />);
    expect(getByTestId("default-title")).toBeTruthy();
  });

  it("renders going outside button", () => {
    const { getByTestId } = render(<IndoorMap path={path} index={1} />);
    expect(getByTestId("outside-button")).toBeTruthy();
  });

  test("TouchableOpacity triggers goOutside and navigates correctly", async () => {
    // Mock data for buildings and POI
    const mockBuildings = [
      { id: 1, building_code: "H8", name: "Building H8" },
      { id: 2, building_code: "H9", name: "Building H9" },
    ];
    const mockPOI = [{ id: 1, building_code: "POI1", name: "Cafeteria" }];

    // Mock functions
    getBuildings.mockResolvedValue(mockBuildings);
    getPointOfInterests.mockResolvedValue(mockPOI);

    const navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });

    const { getByTestId } = render(<TestComponent />);
    const button = getByTestId("outside-button");

    // Simulate button press
    fireEvent.press(button);

    // Wait for async calls and check if navigate was called with the correct arguments
    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalled();
      expect(getPointOfInterests).toHaveBeenCalled();
    });

    // Check the navigation call with expected parameters
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("Navigation", {
        start: mockBuildings[0], // H8
        destination: mockBuildings[1], // H9
        allLocations: [
          { ...mockBuildings[0], id: "school-1" },
          { ...mockBuildings[1], id: "school-2" },
          { ...mockPOI[0], id: "poi-1" },
        ],
      });
    });
  });
});
