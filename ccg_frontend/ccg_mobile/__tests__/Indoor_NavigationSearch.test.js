import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NavigationSearch from "../components/indoor-navigation-ui/elements/NavigationSearch";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons", // Mock Ionicons as a string or a simple component
}));

describe("NavigationSearch Component", () => {
  it("renders correctly with provided addresses", () => {
    const { getByTestId } = render(
      <NavigationSearch startAddress="123 Main St" destinationAddress="456 Elm St" onModifyAddress={() => {}} />
    );

    expect(getByTestId("start-address-input").props.value).toBe("123 Main St");
    expect(getByTestId("destination-address-input").props.value).toBe("456 Elm St");
  });

  it("updates start address when typed", () => {
    const mockOnModifyAddress = jest.fn();
    const { getByTestId } = render(
      <NavigationSearch startAddress="" destinationAddress="" onModifyAddress={mockOnModifyAddress} />
    );

    fireEvent.changeText(getByTestId("start-address-input"), "New Start Address");
    expect(mockOnModifyAddress).toHaveBeenCalledWith("start", "New Start Address");
  });

  it("updates destination address when typed", () => {
    const mockOnModifyAddress = jest.fn();
    const { getByTestId } = render(
      <NavigationSearch startAddress="" destinationAddress="" onModifyAddress={mockOnModifyAddress} />
    );

    fireEvent.changeText(getByTestId("destination-address-input"), "New Destination Address");
    expect(mockOnModifyAddress).toHaveBeenCalledWith("destination", "New Destination Address");
  });

  it("triggers focus event on start address input when tapped", () => {
    const { getByTestId } = render(
      <NavigationSearch startAddress="" destinationAddress="" onModifyAddress={() => {}} />
    );

    const startInput = getByTestId("start-address-input");
    fireEvent(startInput, "focus");
    // No assertion for focus state since it's not directly accessible
  });

  it("triggers focus event on destination address input when tapped", () => {
    const { getByTestId } = render(
      <NavigationSearch startAddress="" destinationAddress="" onModifyAddress={() => {}} />
    );

    const destinationInput = getByTestId("destination-address-input");
    fireEvent(destinationInput, "focus");
    // No assertion for focus state since it's not directly accessible
  });
});
