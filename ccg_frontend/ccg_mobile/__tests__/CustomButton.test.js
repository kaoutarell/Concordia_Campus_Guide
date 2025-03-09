import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../components/navigation-screen-ui/elements/CustomButton";

describe("CustomButton", () => {
  it("renders correctly with title", () => {
    const { getByText } = render(<CustomButton title="Test Button" onPress={() => {}} />);

    // Check if the button title is displayed
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress function when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Press Me" onPress={mockOnPress} />);

    // Press the button
    fireEvent.press(getByText("Press Me"));

    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalled();
  });

  it("renders with special characters in the title", () => {
    const { getByText } = render(<CustomButton title="←" onPress={() => {}} />);

    // Check if special character is displayed
    expect(getByText("←")).toBeTruthy();
  });

});
