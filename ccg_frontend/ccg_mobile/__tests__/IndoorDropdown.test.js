import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndoorDropdown from "../components/indoor-navigation-ui/elements/IndoorDropdown";
import Icon from "react-native-vector-icons/MaterialIcons";

// Mock the Icon component
jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");

describe("IndoorDropdown", () => {
  const mockOptions = [
    { label: "Henry F. Hall Building", value: "1" },
    { label: "John Molson Building", value: "2" },
  ];
  const mockSelectedValue = "1";
  const mockOnValueChange = jest.fn();
  const mockPlaceholder = "Select a building";

  it("renders correctly with the selected value", () => {
    const { getByText } = render(
      <IndoorDropdown
        options={mockOptions}
        selectedValue={mockSelectedValue}
        onValueChange={mockOnValueChange}
        placeholder={mockPlaceholder}
      />
    );

    // Check if the selected value is displayed
    expect(getByText("Henry F. Hall Building")).toBeTruthy();
  });

  it("renders the placeholder when no value is selected", () => {
    const { getByText } = render(
      <IndoorDropdown
        options={mockOptions}
        selectedValue={null}
        onValueChange={mockOnValueChange}
        placeholder={mockPlaceholder}
      />
    );

    // Check if the placeholder is displayed
    expect(getByText("Select a building")).toBeTruthy();
  });

  it("toggles dropdown visibility when the input is pressed", () => {
    const { getByTestId, queryByTestId } = render(
      <IndoorDropdown
        options={mockOptions}
        selectedValue={mockSelectedValue}
        onValueChange={mockOnValueChange}
        placeholder={mockPlaceholder}
      />
    );

    // Dropdown should not be visible initially
    expect(queryByTestId("dropdown")).toBeNull();

    // Simulate pressing the input to open the dropdown
    fireEvent.press(getByTestId("dropdown-input"));

    // Dropdown should now be visible
    expect(getByTestId("dropdown")).toBeTruthy();

    // Simulate pressing the input again to close the dropdown
    fireEvent.press(getByTestId("dropdown-input"));

    // Dropdown should now be hidden
    expect(queryByTestId("dropdown")).toBeNull();
  });

  it("calls onValueChange when an item is selected", () => {
    const { getByTestId, getByText } = render(
      <IndoorDropdown
        options={mockOptions}
        selectedValue={mockSelectedValue}
        onValueChange={mockOnValueChange}
        placeholder={mockPlaceholder}
      />
    );

    // Open the dropdown
    fireEvent.press(getByTestId("dropdown-input"));

    // Simulate selecting an item
    fireEvent.press(getByText("John Molson Building"));

    // Ensure onValueChange is called with the correct value
    expect(mockOnValueChange).toHaveBeenCalledWith("2");
  });

  it("hides the dropdown after selecting an item", () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <IndoorDropdown
        options={mockOptions}
        selectedValue={mockSelectedValue}
        onValueChange={mockOnValueChange}
        placeholder={mockPlaceholder}
      />
    );

    // Open the dropdown
    fireEvent.press(getByTestId("dropdown-input"));

    // Simulate selecting an item
    fireEvent.press(getByText("John Molson Building"));

    // Dropdown should now be hidden
    expect(queryByTestId("dropdown")).toBeNull();
  });
});
