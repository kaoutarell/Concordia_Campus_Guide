import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import DirectionsButton from "../components/map-screen-ui/elements/DirectionsButton"; // Adjust the path as needed

// Mock the vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "Ionicons",
  FontAwesome5: () => "FontAwesome5",
}));

describe("DirectionsButton", () => {
  const mockHandleSelect = jest.fn(); // Mock the handleSelect function

  const defaultProps = {
    handleSelect: mockHandleSelect,
    value: { id: 1 }, // Example value prop
    startLocation: { id: 1 }, // Example startLocation prop
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render correctly", () => {
    render(<DirectionsButton {...defaultProps} />);

    // Ensure the button is rendered
    expect(screen.getByTestId("get-directions-button")).toBeTruthy();
    expect(screen.getByText("Get Directions")).toBeTruthy();
  });

  it("should show the modal when the button is pressed", () => {
    render(<DirectionsButton {...defaultProps} />);

    // Press the directions button
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Verify the modal is visible
    expect(screen.getByText("Set as Start")).toBeTruthy();
    expect(screen.getByText("Set as Destination")).toBeTruthy();
    expect(screen.getByText("Close")).toBeTruthy();
  });

  it('should call handleSelect with "start" when Set as Start is pressed', () => {
    render(<DirectionsButton {...defaultProps} />);

    // Open the modal
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Press the "Set as Start" option
    fireEvent.press(screen.getByText("Set as Start"));

    // Verify the handleSelect function was called with "start"
    expect(mockHandleSelect).toHaveBeenCalledWith("start");
  });

  it('should call handleSelect with "destination" when Set as Destination is pressed', () => {
    render(<DirectionsButton {...defaultProps} />);

    // Open the modal
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Press the "Set as Destination" option
    fireEvent.press(screen.getByText("Set as Destination"));

    // Verify the handleSelect function was called with "destination"
    expect(mockHandleSelect).toHaveBeenCalledWith("destination");
  });

  it("should close the modal when clicking outside the modal", () => {
    render(<DirectionsButton {...defaultProps} />);

    // Open the modal
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Ensure the modal is visible
    expect(screen.getByText("Set as Start")).toBeTruthy();

    // Click outside the modal (on the overlay)
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Ensure the modal is not visible anymore
    expect(screen.queryByText("Set as Start")).toBeNull();
  });

  it("should close the modal when the Close button is pressed", () => {
    render(<DirectionsButton {...defaultProps} />);

    // Open the modal
    fireEvent.press(screen.getByTestId("get-directions-button"));

    // Ensure the modal is visible
    expect(screen.getByText("Set as Start")).toBeTruthy();

    // Press the Close button
    fireEvent.press(screen.getByText("Close"));

    // Ensure the modal is not visible anymore
    expect(screen.queryByText("Set as Start")).toBeNull();
  });
});
