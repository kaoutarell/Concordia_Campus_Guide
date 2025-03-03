import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomMarker from "../components/map-screen-ui/elements/CustomMarker";

// Mock `react-native-maps` to avoid issues during testing
jest.mock("react-native-maps", () => {
  return {
    // Mocking the `Marker` component to prevent rendering errors in Jest
    Marker: jest.fn(({ children }) => <>{children}</>),
  };
});

// Describe block groups related tests together
describe("CustomMarker Component", () => {
  // Mock data to simulate a real marker value
  const mockValue = {
    location: { latitude: 37.7749, longitude: -122.4194 }, // Mock latitude and longitude
    building_code: "EV", // Mock building code
  };

  // Test case 1: Check if the component renders properly with given data
  it("renders correctly with given value", () => {
    // Render the component with mock data and a dummy onPress function
    const { getByText } = render(<CustomMarker value={mockValue} onPress={jest.fn()} />);

    // Check if the text "B123" (building code) is displayed
    expect(getByText("EV")).toBeTruthy();
  });

  // Test case 2: Ensure that `onPress` is called when the marker is clicked
  it("calls onPress when marker is pressed", () => {
    const mockOnPress = jest.fn(); // Create a mock function to track calls

    // Render the component with the mock function
    const { getByTestId } = render(<CustomMarker value={mockValue} onPress={mockOnPress} />);

    // Simulate a press event on the marker
    fireEvent.press(getByTestId("marker-container")); // Ensure testID exists in the component

    // Verify that the `onPress` function was called once
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
