import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CampusSelector from "../components/CampusSelector";

describe("CampusSelector", () => {
    const mockOnCampusSelect = jest.fn();

    it("renders the campus name and toggles campus on button press", () => {
        // Render the component with the default campus 'SGW'
        const { getByText, getByTestId } = render(
            <CampusSelector selectedCampus="SGW" onCampusSelect={mockOnCampusSelect} />
        );

        // Check if the campus name 'SGW' is displayed
        expect(getByText("SGW")).toBeTruthy();

        // Simulate pressing the button to toggle campus
        fireEvent.press(getByTestId("campus-button"));

        // Check if the mock function was called
        expect(mockOnCampusSelect).toHaveBeenCalledWith("LOY");
    });

    it("toggles campus correctly when 'SGW' is selected", () => {
        const { getByText, getByTestId } = render(
            <CampusSelector selectedCampus="SGW" onCampusSelect={mockOnCampusSelect} />
        );

        // Initial campus should be 'SGW'
        expect(getByText("SGW")).toBeTruthy();

        // Simulate pressing the button
        fireEvent.press(getByTestId("campus-button"));

        // Check if the 'LOY' campus is passed to onCampusSelect
        expect(mockOnCampusSelect).toHaveBeenCalledWith("LOY");
    });

    it("toggles campus correctly when 'LOY' is selected", () => {
        const { getByText, getByTestId } = render(
            <CampusSelector selectedCampus="LOY" onCampusSelect={mockOnCampusSelect} />
        );

        // Initial campus should be 'LOY'
        expect(getByText("LOY")).toBeTruthy();

        // Simulate pressing the button
        fireEvent.press(getByTestId("campus-button"));

        // Check if the 'SGW' campus is passed to onCampusSelect
        expect(mockOnCampusSelect).toHaveBeenCalledWith("SGW");
    });
});
