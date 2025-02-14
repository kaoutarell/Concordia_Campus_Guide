import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import NavigationToggle from "../components/map-screen-ui/sections/NavigationToggle"; // Adjust path

describe("NavigationToggle", () => {
  it("renders the NavigationToggle component", () => {
    const mockSetIsIndoor = jest.fn();
    render(<NavigationToggle isIndoor={false} setIsIndoor={mockSetIsIndoor} />);

    expect(screen.getByText("Outdoor")).toBeTruthy();
    expect(screen.getByText("Indoor")).toBeTruthy();
  });

  it("calls setIsIndoor with false when Outdoor is pressed", () => {
    const mockSetIsIndoor = jest.fn();
    render(<NavigationToggle isIndoor={true} setIsIndoor={mockSetIsIndoor} />); // Start with isIndoor=true

    fireEvent.press(screen.getByText("Outdoor"));
    expect(mockSetIsIndoor).toHaveBeenCalledWith(false);
  });

  it("calls setIsIndoor with true when Indoor is pressed", () => {
    const mockSetIsIndoor = jest.fn();
    render(<NavigationToggle isIndoor={false} setIsIndoor={mockSetIsIndoor} />); // Start with isIndoor=false

    fireEvent.press(screen.getByText("Indoor"));
    expect(mockSetIsIndoor).toHaveBeenCalledWith(true);
  });
});
