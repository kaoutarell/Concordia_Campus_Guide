import React from "react";
import { render } from "@testing-library/react-native";
import IndoorMap from "../components/indoor-navigation-ui/sections/IndoorMap";

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

const path = {
  floor_sequence: ["H8"],
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
});
