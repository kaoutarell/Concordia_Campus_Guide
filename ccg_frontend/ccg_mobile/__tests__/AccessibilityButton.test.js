import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AccessibilityButton from "../components/indoor-navigation-ui/elements/AccessibilityButton";

describe("AccessibilityButton", () => {
  it("renders correctly with showAccessibleRoute=false", () => {
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    const { getByTestId } = render(
      <AccessibilityButton
        showAccessibleRoute={false}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Get the button element when showAccessibleRoute is false
    const button = getByTestId("accessibility-button");
    expect(button).toBeTruthy();

    // Verify the styles - since we can't check the specific styles directly,
    // we can verify that the button exists and renders properly
    expect(button.props.style.backgroundColor).toBe("#800020"); // Burgundy
  });

  it("renders correctly with showAccessibleRoute=true", () => {
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    const { getByTestId } = render(
      <AccessibilityButton
        showAccessibleRoute={true}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Get the button element when showAccessibleRoute is true
    const button = getByTestId("accessibility-button");
    expect(button).toBeTruthy();

    // Verify that the correct button is rendered (the white one)
    expect(button.props.style.backgroundColor).toBe("white");
  });

  it("handles press events correctly when showAccessibleRoute=false", () => {
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    const { getByTestId } = render(
      <AccessibilityButton
        showAccessibleRoute={false}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Simulate a press event
    fireEvent.press(getByTestId("accessibility-button"));

    // Check if the setShowAccessibleRoute and onShowDirections functions were called
    expect(setShowAccessibleRoute).toHaveBeenCalledWith(true);
    expect(onShowDirections).toHaveBeenCalled();
  });

  it("handles press events correctly when showAccessibleRoute=true", () => {
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    const { getByTestId } = render(
      <AccessibilityButton
        showAccessibleRoute={true}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Simulate a press event
    fireEvent.press(getByTestId("accessibility-button"));

    // Check if the setShowAccessibleRoute and onShowDirections functions were called
    expect(setShowAccessibleRoute).toHaveBeenCalledWith(false);
    expect(onShowDirections).toHaveBeenCalled();
  });

  it("renders wheelchair icon with different colors based on accessibility state", () => {
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    // Render with accessibility off
    const { UNSAFE_getByType, rerender } = render(
      <AccessibilityButton
        showAccessibleRoute={false}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Find image and verify its tint color
    const imageOff = UNSAFE_getByType("Image");
    expect(imageOff.props.style.tintColor).toBe("white");

    // Now rerender with accessibility on
    rerender(
      <AccessibilityButton
        showAccessibleRoute={true}
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
        testID="accessibility-button"
      />
    );

    // Find image and verify its tint color
    const imageOn = UNSAFE_getByType("Image");
    expect(imageOn.props.style.tintColor).toBe("black");
  });

  it("provides default props when not provided", () => {
    // Mock default props to prevent errors
    const setShowAccessibleRoute = jest.fn();
    const onShowDirections = jest.fn();

    // Create a shallow version of the component
    const { getByTestId } = render(
      <AccessibilityButton
        testID="accessibility-button"
        setShowAccessibleRoute={setShowAccessibleRoute}
        onShowDirections={onShowDirections}
      />
    );

    // Since showAccessibleRoute defaults to undefined/false, it should render the burgundy button
    const button = getByTestId("accessibility-button");
    expect(button.props.style.backgroundColor).toBe("#800020");
  });
});
