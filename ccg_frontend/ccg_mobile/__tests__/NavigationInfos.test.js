import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NavigationInfos from "../components/navigation-screen-ui/sections/NavigationInfos";

// Mock dependencies
jest.mock("@expo/vector-icons", () => ({
  FontAwesome5: () => "Icon",
}));

describe("NavigationInfos", () => {
  const defaultProps = {
    totalDuration: 1200, // 20 minutes in seconds
    totalDistance: 2500, // 2.5 km in meters
    onExit: jest.fn(),
    onShowDirections: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with duration and distance", () => {
    const { getByText } = render(<NavigationInfos {...defaultProps} />);

    // Check if duration and distance are displayed correctly
    expect(getByText("20 minutes")).toBeTruthy();
    expect(getByText("2.50 km")).toBeTruthy();

    // Check if buttons are rendered
    expect(getByText("Preview")).toBeTruthy();
    expect(getByText("Exit")).toBeTruthy();
  });

  it("renders with fallback text when duration and distance are missing", () => {
    const props = {
      ...defaultProps,
      totalDuration: null,
      totalDistance: null,
    };

    const { getByText } = render(<NavigationInfos {...props} />);

    // Check if fallback texts are displayed
    expect(getByText("Duration not available")).toBeTruthy();
    expect(getByText("Distance not available")).toBeTruthy();
  });

  it("calls onShowDirections when DIR button is pressed", () => {
    const { getByText } = render(<NavigationInfos {...defaultProps} />);

    // Press the DIR button
    fireEvent.press(getByText("Preview"));

    // Check if onShowDirections was called
    expect(defaultProps.onShowDirections).toHaveBeenCalled();
  });

  it("calls onExit when Exit button is pressed", () => {
    const { getByText } = render(<NavigationInfos {...defaultProps} />);

    // Press the Exit button
    fireEvent.press(getByText("Exit"));

    // Check if onExit was called
    expect(defaultProps.onExit).toHaveBeenCalled();
  });
});
