import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FloorChangeButton from "../components/indoor-navigation-ui/elements/FloorChangeButton";

describe("IndoorMap Component", () => {
  it("displays prev button", () => {
    const { getByTestId } = render(<FloorChangeButton />);
    expect(getByTestId("prev-button")).toBeTruthy();
  });

  it("calls onPress function when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<FloorChangeButton index={1} maxIndex={5} setIndex={mockOnPress} />);

    // Press the button
    fireEvent.press(getByTestId("prev-button"));

    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalled();
  });

  it("displays next button", () => {
    const { getByTestId } = render(<FloorChangeButton />);
    expect(getByTestId("next-button")).toBeTruthy();
  });

  it("calls onPress function when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<FloorChangeButton index={1} maxIndex={5} setIndex={mockOnPress} />);

    // Press the button
    fireEvent.press(getByTestId("next-button"));

    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
