import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NavigationHeader from "../components/navigation-screen-ui/sections/NavigationHeader";

// Mock dependencies
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "MockIcon",
}));

// Mock the nested components
jest.mock("../components/navigation-screen-ui/elements/NavigationSearch", () => {
  const { View } = require("react-native");
  return () => <View testID="navigation-search" />;
});

jest.mock("../components/navigation-screen-ui/elements/CustomButton", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} testID="back-button">
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock("../components/navigation-screen-ui/elements/NavigationMode", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ mode, name, onModeChange }) => (
    <TouchableOpacity onPress={() => onModeChange(mode)} testID={`mode-${mode}`}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
});

// Mock the transport modes
jest.mock("../constants/TransportModes", () => ({
  modes: [
    { mode: "foot-walking", name: "Walk", icon: "icon" },
    { mode: "cycling-regular", name: "Bike", icon: "icon" },
    { mode: "driving-car", name: "Car", icon: "icon" },
    { mode: "public-transport", name: "Bus", icon: "icon" },
    { mode: "concordia-shuttle", name: "Shuttle", icon: "icon" },
  ],
}));

describe("NavigationHeader", () => {
  const defaultProps = {
    startAddress: "Hall Building",
    destinationAddress: "Loyola Campus",
    onSelectedMode: jest.fn(),
    onModifyAddress: jest.fn(),
    selectedMode: "foot-walking",
    allLocations: [],
    onBackPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props", () => {
    const { getByTestId, getByText } = render(<NavigationHeader {...defaultProps} />);

    // Check if the main components are rendered
    expect(getByTestId("back-button")).toBeTruthy();
    expect(getByTestId("navigation-search")).toBeTruthy();

    // Check if all transport modes are rendered
    expect(getByTestId("mode-foot-walking")).toBeTruthy();
    expect(getByTestId("mode-cycling-regular")).toBeTruthy();
    expect(getByTestId("mode-driving-car")).toBeTruthy();
    expect(getByTestId("mode-public-transport")).toBeTruthy();
    expect(getByTestId("mode-concordia-shuttle")).toBeTruthy();

    // Check if the mode names are rendered
    expect(getByText("Walk")).toBeTruthy();
    expect(getByText("Bike")).toBeTruthy();
    expect(getByText("Car")).toBeTruthy();
    expect(getByText("Bus")).toBeTruthy();
    expect(getByText("Shuttle")).toBeTruthy();
  });

  it("calls onBackPress when back button is pressed", () => {
    const { getByTestId } = render(<NavigationHeader {...defaultProps} />);

    // Press the back button
    fireEvent.press(getByTestId("back-button"));

    // Check if onBackPress was called
    expect(defaultProps.onBackPress).toHaveBeenCalled();
  });

  it("calls onSelectedMode when a transport mode is selected", () => {
    const { getByTestId } = render(<NavigationHeader {...defaultProps} />);

    // Select a different transport mode
    fireEvent.press(getByTestId("mode-cycling-regular"));

    // Check if onSelectedMode was called with the correct mode
    expect(defaultProps.onSelectedMode).toHaveBeenCalledWith("cycling-regular");
  });

  it("applies active style to the selected mode", () => {
    const props = {
      ...defaultProps,
      selectedMode: "public-transport",
    };

    const { getByTestId } = render(<NavigationHeader {...props} />);

    // Select another transport mode
    fireEvent.press(getByTestId("mode-cycling-regular"));

    // Check if onSelectedMode was called with the correct mode
    expect(props.onSelectedMode).toHaveBeenCalledWith("cycling-regular");
  });
});
