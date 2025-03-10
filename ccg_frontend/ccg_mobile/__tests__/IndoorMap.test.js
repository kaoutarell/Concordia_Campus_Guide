import React from "react";
import { render } from "@testing-library/react-native";
import IndoorMap from "../components/indoor_navigation/sections/IndoorMap";

// Mock the image asset
jest.mock("../components/indoor_navigation/floors/Hall-8.png", () => "mocked-image-path");

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

describe("IndoorMap Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<IndoorMap path={{}} />);
    expect(getByText("ReactNativeZoomableView")).toBeTruthy();
  });

  it("displays the start pin when coordinates are provided", () => {
    const path = { pin: [[200, 300], []] };
    const { getByTestId } = render(<IndoorMap path={path} />);
    expect(getByTestId("start-pin")).toBeTruthy();
  });

  it("displays the destination pin when coordinates are provided", () => {
    const path = { pin: [[], [400, 500]] };
    const { getByTestId } = render(<IndoorMap path={path} />);
    expect(getByTestId("destination-pin")).toBeTruthy();
  });

  it("renders the path when path_data is provided", () => {
    const path = { path_data: "M10 10 L90 90" };
    const { getByTestId } = render(<IndoorMap path={path} />);
    expect(getByTestId("path-svg")).toBeTruthy();
  });
});
