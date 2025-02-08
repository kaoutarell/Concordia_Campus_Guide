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
    it("renders correctly with all child components", () => {
        const { getByTestId } = render(
            <HeaderBar searchText="" setSearchText={jest.fn()} selectedCampus="Campus A" onCampusSelect={jest.fn()} />
        );

        // Check if all mocked components are rendered
        expect(getByTestId("menu-button")).toBeTruthy();
        expect(getByTestId("search-bar")).toBeTruthy();
        expect(getByTestId("campus-selector")).toBeTruthy();
    });
});
