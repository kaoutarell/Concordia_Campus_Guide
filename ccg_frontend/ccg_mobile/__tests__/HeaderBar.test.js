import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HeaderBar from "../components/HeaderBar"; // Adjust path if needed
import { View } from "react-native";

//Define mock components with View inside the mock function
jest.mock("../components/MenuButton", () => {
  return () => {
    return <View testID="menu-button" />;
  };
});

jest.mock("../components/SearchBar", () => {
  return ({ setSearchText }) => {
    return (
      <View
        testID="search-bar"
        onTouchStart={() => setSearchText("New Search")}
      />
    );
  };
});

jest.mock("../components/CampusSelector", () => {
  return ({ onCampusSelect }) => {
    return (
      <View
        testID="campus-selector"
        onTouchStart={() => onCampusSelect("LOY")}
      />
    );
  };
});

describe("HeaderBar Component", () => {
  //Test case 1:
  it("renders correctly with all child components", () => {
    const { getByTestId } = render(
      <HeaderBar
        searchText=""
        setSearchText={jest.fn()}
        selectedCampus="SGW"
        onCampusSelect={jest.fn()}
      />
    );

    // Check if all mocked components are rendered
    expect(getByTestId("menu-button")).toBeTruthy();
    expect(getByTestId("search-bar")).toBeTruthy();
    expect(getByTestId("campus-selector")).toBeTruthy();
  });

  //Test case 2:
  // it("calls setSearchText when search text changes", () => {
  //     const mockSetSearchText = jest.fn();

  //     const { getByTestId } = render(
  //         <HeaderBar searchText="" setSearchText={mockSetSearchText} selectedCampus="SGW" onCampusSelect={jest.fn()} />
  //     );

  //     // Simulate user interacting with SearchBar
  //     fireEvent(getByTestId("search-bar"), "touchStart");

  //     // Verify setSearchText is called
  //     expect(mockSetSearchText).toHaveBeenCalledWith("New Search");
  // });

  //Test case 3:
  it("calls onCampusSelect when a campus is selected", () => {
    const mockOnCampusSelect = jest.fn();

    const { getByTestId } = render(
      <HeaderBar
        searchText=""
        setSearchText={jest.fn()}
        selectedCampus="SGW"
        onCampusSelect={mockOnCampusSelect}
      />
    );

    // Simulate user interacting with CampusSelector
    fireEvent(getByTestId("campus-selector"), "touchStart");

    // Verify onCampusSelect is called with new value
    expect(mockOnCampusSelect).toHaveBeenCalledWith("LOY");
  });
});
