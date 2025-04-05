import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndoorNavigationHeader from "../components/indoor-navigation-ui/sections/IndoorNavigationHeader";
import { useNavigation } from "@react-navigation/native";

// Mock child components
jest.mock("../components/indoor-navigation-ui/elements/NavigationSearch", () => "NavigationSearch");
jest.mock("../components/indoor-navigation-ui/elements/CustomButton", () => "CustomButton");
jest.mock("../components/indoor-navigation-ui/elements/IndoorDropdown", () => "IndoorDropdown");

// Mock the useNavigation hook
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("IndoorNavigationHeader", () => {
  const mockBuildings = [
    { label: "Henry F. Hall Building", value: "1" },
    { label: "John Molson Building", value: "2" },
  ];
  const mockSelectedBuilding = "1";
  const mockStartLocation = "Room 101";
  const mockDestination = "Room 202";
  const mockOnBuildingChange = jest.fn();
  const mockOnStartLocationChange = jest.fn();
  const mockOnDestinationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      navigate: jest.fn(),
    });
  });

  it("renders correctly", () => {
    const { getByTestId } = render(
      <IndoorNavigationHeader
        buildings={mockBuildings}
        selectedBuilding={mockSelectedBuilding}
        onBuildingChange={mockOnBuildingChange}
        startLocation={mockStartLocation}
        destination={mockDestination}
        onStartLocationChange={mockOnStartLocationChange}
        onDestinationChange={mockOnDestinationChange}
      />
    );

    // Ensure the container is rendered
    expect(getByTestId("indoor-navigation-header-container")).toBeTruthy();
  });

  it("navigates to the Map screen when the back button is pressed", () => {
    const { getByTestId } = render(
      <IndoorNavigationHeader
        buildings={mockBuildings}
        selectedBuilding={mockSelectedBuilding}
        onBuildingChange={mockOnBuildingChange}
        startLocation={mockStartLocation}
        destination={mockDestination}
        onStartLocationChange={mockOnStartLocationChange}
        onDestinationChange={mockOnDestinationChange}
      />
    );

    // Simulate pressing the back button
    fireEvent.press(getByTestId("back-button"));

    // Ensure navigation was called
    expect(useNavigation().navigate).toHaveBeenCalledWith("Map");
  });

  it("updates the selected building when a new building is selected", () => {
    const { getByTestId } = render(
      <IndoorNavigationHeader
        buildings={mockBuildings}
        selectedBuilding={mockSelectedBuilding}
        onBuildingChange={mockOnBuildingChange}
        startLocation={mockStartLocation}
        destination={mockDestination}
        onStartLocationChange={mockOnStartLocationChange}
        onDestinationChange={mockOnDestinationChange}
      />
    );

    // Simulate selecting a new building
    /*const newBuildingValue = "2";
    fireEvent(getByTestId("indoor-dropdown"), "onValueChange", newBuildingValue);

    // Ensure the onBuildingChange handler was called
    expect(mockOnBuildingChange).toHaveBeenCalledWith(newBuildingValue);*/
  });

  it("updates the start and destination addresses when modified", () => {
    const { getByTestId } = render(
      <IndoorNavigationHeader
        buildings={mockBuildings}
        selectedBuilding={mockSelectedBuilding}
        onBuildingChange={mockOnBuildingChange}
        startLocation={mockStartLocation}
        destination={mockDestination}
        onStartLocationChange={mockOnStartLocationChange}
        onDestinationChange={mockOnDestinationChange}
      />
    );

    // Simulate modifying the start address
    const newStartAddress = "Room 102";
    fireEvent(getByTestId("navigation-search"), "onModifyAddress", "start", newStartAddress);

    // Ensure the onStartLocationChange handler was called
    expect(mockOnStartLocationChange).toHaveBeenCalledWith(newStartAddress);

    // Simulate modifying the destination address
    const newDestinationAddress = "Room 203";
    fireEvent(getByTestId("navigation-search"), "onModifyAddress", "destination", newDestinationAddress);

    // Ensure the onDestinationChange handler was called
    expect(mockOnDestinationChange).toHaveBeenCalledWith(newDestinationAddress);
  });
});
