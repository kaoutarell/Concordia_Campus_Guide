import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HeaderBar from "../components/HeaderBar"; // Adjust path if needed

//Define mock components with View inside the mock function
jest.mock("../components/MenuButton", () => {
    return () => {
        const { View } = require("react-native"); //Import inside the function
        return <View testID="menu-button" />;
    };
});

jest.mock("../components/SearchBar", () => {
    return ({ setSearchText }) => {
        const { View } = require("react-native"); //Import inside the function
        return <View testID="search-bar" onTouchStart={() => setSearchText("New Search")} />;
    };
});

jest.mock("../components/CampusSelector", () => {
    return ({ onCampusSelect }) => {
        const { View } = require("react-native"); //Import inside the function
        return <View testID="campus-selector" onTouchStart={() => onCampusSelect("New Campus")} />;
    };
});

describe("HeaderBar Component", () => {
    //Test case 1:
    it("renders correctly with all child components", () => {
        const { getByTestId } = render(
            <HeaderBar searchText="" setSearchText={jest.fn()} selectedCampus="SGW" onCampusSelect={jest.fn()} />
        );

        // Check if all mocked components are rendered
        expect(getByTestId("menu-button")).toBeTruthy();
        expect(getByTestId("search-bar")).toBeTruthy();
        expect(getByTestId("campus-selector")).toBeTruthy();
    });

    //Test case 2: 
    it("calls setSearchText when search text changes", () => {
        const mockSetSearchText = jest.fn();

        const { getByTestId } = render(
            <HeaderBar searchText="" setSearchText={mockSetSearchText} selectedCampus="SGW" onCampusSelect={jest.fn()} />
        );

        // Simulate user interacting with SearchBar
        fireEvent(getByTestId("search-bar"), "touchStart");

        // Verify setSearchText is called
        expect(mockSetSearchText).toHaveBeenCalledWith("New Search");
    });
});
