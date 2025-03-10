import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../components/indoor_navigation/elements/CustomButton";

describe("CustomButton Component", () => {
  it("renders correctly with given title", () => {
    const { getByTestId } = render(<CustomButton title="Click Me" onPress={() => {}} />);
    expect(getByTestId("custom-button-text").props.children).toBe("Click Me");
  });

  it("calls onPress function when clicked", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<CustomButton title="Press" onPress={mockOnPress} />);

    fireEvent.press(getByTestId("custom-button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
