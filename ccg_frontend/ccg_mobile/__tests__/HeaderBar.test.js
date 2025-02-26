/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HeaderBar from "../components/map-screen-ui/sections/HeaderBar"; // Adjust path if needed

//Define mock components with View inside the mock function
jest.mock("../components/map-screen-ui/elements/MenuButton", () => {
  return () => {
    const { View } = require("react-native"); // Import inside the function to avoid Jest scope issues
    return <View testID="menu-button" />;
  };
});

jest.mock("../components/map-screen-ui/elements/SearchBar", () => {
  return ({ setTargetLocation }) => {
    const { View } = require("react-native"); // Import inside the function to avoid Jest scope issues
    return (
      <View
        testID="search-bar"
        onTouchStart={() => setTargetLocation({ name: "Test Location" })}
      />
    );
  };
});

jest.mock("../components/map-screen-ui/elements/CampusSelector", () => {
  const { View } = require("react-native"); // Import inside the function to avoid Jest scope issues
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
  // Mock locations data
  const mockLocations = [
    { id: '1', name: 'Building A', campus: 'SGW' },
    { id: '2', name: 'Building B', campus: 'LOY' }
  ];

  //Test case 1:
  it("renders correctly with all child components", () => {
    const { getByTestId } = render(
      <HeaderBar
        selectedCampus="SGW"
        onCampusSelect={jest.fn()}
        setSelectedCampus={jest.fn()}
        locations={mockLocations}
        setTargetLocation={jest.fn()}
      />
    );

    // Check if all mocked components are rendered
    expect(getByTestId("menu-button")).toBeTruthy();
    expect(getByTestId("search-bar")).toBeTruthy();
    expect(getByTestId("campus-selector")).toBeTruthy();
  });



  //Test case 2:
  it("calls onCampusSelect when a campus is selected", () => {
    const mockOnCampusSelect = jest.fn();

    const { getByTestId } = render(
      <HeaderBar
        selectedCampus="SGW"
        onCampusSelect={mockOnCampusSelect}
        setSelectedCampus={jest.fn()}
        locations={mockLocations}
        setTargetLocation={jest.fn()}
      />
    );

    // Simulate user interacting with CampusSelector
    fireEvent(getByTestId("campus-selector"), "touchStart");

    // Verify onCampusSelect is called with new value
    expect(mockOnCampusSelect).toHaveBeenCalledWith("LOY");
  });
});
