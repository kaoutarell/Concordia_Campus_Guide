import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndoorNavigationFooter from "../components/indoor-navigation-ui/sections/IndoorNavigationFooter";
import Icon from "react-native-vector-icons/FontAwesome";

// Mock the Icon component
jest.mock("react-native-vector-icons/FontAwesome", () => "Icon");

describe("IndoorNavigationFooter", () => {
  const mockOnShowDirections = jest.fn();
  const mockStartAddress = "Room 101";
  const mockDestinationAddress = "Room 202";

  it("renders correctly", () => {
    const { getByText, getByTestId } = render(
      <IndoorNavigationFooter
        onShowDirections={mockOnShowDirections}
        startAddress={mockStartAddress}
        destinationAddress={mockDestinationAddress}
      />
    );

    // Check if the component renders the correct text - ok
    expect(getByText("Get Direction")).toBeTruthy();

    // Check if the Icon component is rendered - ok
    expect(getByTestId("icon")).toBeTruthy();
  });

  it("calls onShowDirections with the correct arguments when the button is pressed", () => {
    const { getByText } = render(
      <IndoorNavigationFooter
        onShowDirections={mockOnShowDirections}
        startAddress={mockStartAddress}
        destinationAddress={mockDestinationAddress}
      />
    );

    // Simulate pressing the button
    fireEvent.press(getByText("Get Direction"));

    // Ensure onShowDirections is called with the correct arguments
    expect(mockOnShowDirections).toHaveBeenCalledWith(mockStartAddress, mockDestinationAddress);
  });

  it("applies the correct styles", () => {
    const { getByTestId } = render(
      <IndoorNavigationFooter
        onShowDirections={mockOnShowDirections}
        startAddress={mockStartAddress}
        destinationAddress={mockDestinationAddress}
      />
    );

    // Style verification ---------- Check if the container has the correct styles - ok
    const container = getByTestId("footer-container");
    expect(container.props.style).toMatchObject({
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#800020",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      paddingVertical: 30,
    });

    // Check if the button has the correct styles
    const button = getByTestId("start-button");
    expect(button.props.style).toMatchObject({
      backgroundColor: "#fff",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 30,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      width: 200,
      marginVertical: 5,
    });

    // Check if the button text has the correct styles
    const buttonText = getByTestId("start-button-text");
    expect(buttonText.props.style).toMatchObject({
      fontSize: 14,
      fontWeight: "bold",
      color: "#800020",
      marginLeft: 10,
    });
  });
});
