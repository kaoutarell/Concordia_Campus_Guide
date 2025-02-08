import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NavigationToggle from "../components/NavigationToggle";

describe("NavigationToggle", () => {
    const mockSetIsIndoor = jest.fn();

    it("renders both Outdoor and Indoor buttons", () => {
        const { getByText } = render(
            <NavigationToggle isIndoor={false} setIsIndoor={mockSetIsIndoor} />
        );

        expect(getByText("Outdoor")).toBeTruthy();
        expect(getByText("Indoor")).toBeTruthy();
    });

    it("calls setIsIndoor with false when Outdoor button is pressed", () => {
        const { getByText } = render(
            <NavigationToggle isIndoor={true} setIsIndoor={mockSetIsIndoor} />
        );

        fireEvent.press(getByText("Outdoor"));
        expect(mockSetIsIndoor).toHaveBeenCalledWith(false);
    });

    it("calls setIsIndoor with true when Indoor button is pressed", () => {
        const { getByText } = render(
            <NavigationToggle isIndoor={false} setIsIndoor={mockSetIsIndoor} />
        );

        fireEvent.press(getByText("Indoor"));
        expect(mockSetIsIndoor).toHaveBeenCalledWith(true);
    });
});
