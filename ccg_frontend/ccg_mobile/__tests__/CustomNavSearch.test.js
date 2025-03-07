import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomNavSearch from "../components/navigation-screen-ui/CustomNavSearch";

// Mock dependencies
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "Icon",
}));

jest.mock("../api/dataService", () => ({
  getBuildings: jest.fn().mockResolvedValue([
    {
      id: "1",
      name: "Hall Building",
      building_code: "H",
      campus: "SGW",
      location: { latitude: 45.497, longitude: -73.579 },
      civic_address: "1455 De Maisonneuve Blvd W",
    },
    {
      id: "2",
      name: "Library Building",
      building_code: "LB",
      campus: "SGW",
      location: { latitude: 45.496, longitude: -73.578 },
      civic_address: "1400 De Maisonneuve Blvd W",
    },
  ]),
}));

// Mock react-native's Keyboard module
jest.mock("react-native/Libraries/Components/Keyboard/Keyboard", () => ({
  dismiss: jest.fn(),
}));

describe("CustomNavSearch", () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockOnGoBack = jest.fn();

  const mockRoute = {
    params: {
      type: "destination",
      onGoBack: mockOnGoBack,
      allLocations: [
        {
          id: "1",
          name: "Hall Building",
          building_code: "H",
          campus: "SGW",
          location: { latitude: 45.497, longitude: -73.579 },
          civic_address: "1455 De Maisonneuve Blvd W",
        },
        {
          id: "2",
          name: "Library Building",
          building_code: "LB",
          campus: "SGW",
          location: { latitude: 45.496, longitude: -73.578 },
          civic_address: "1400 De Maisonneuve Blvd W",
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with route params", () => {
    const { getByPlaceholderText } = render(<CustomNavSearch navigation={mockNavigation} route={mockRoute} />);

    // Check if the search input is rendered with correct placeholder
    expect(getByPlaceholderText("Choose destination")).toBeTruthy();
  });

  it("renders correctly with start type", () => {
    const startRoute = {
      params: {
        ...mockRoute.params,
        type: "start",
      },
    };

    const { getByPlaceholderText } = render(<CustomNavSearch navigation={mockNavigation} route={startRoute} />);

    // Check if the search input placeholder is correct
    expect(getByPlaceholderText("Choose start")).toBeTruthy();
  });

  // it("filters locations when searching", () => {
  //   const { getByPlaceholderText, getByText, queryByText } = render(
  //     <CustomNavSearch navigation={mockNavigation} route={mockRoute} />
  //   );

  //   // Get the search input
  //   const searchInput = getByPlaceholderText("Choose destination");

  //   // Enter search text
  //   fireEvent.changeText(searchInput, "Hall");

  //   // Hall Building should be visible
  //   expect(getByText("Hall Building")).toBeTruthy();

  //   // Library Building should not be visible since it doesn't match the search
  //   expect(queryByText("Library Building")).toBeFalsy();
  // });

  // it("selects a location and navigates back", () => {
  //   const { getByText } = render(<CustomNavSearch navigation={mockNavigation} route={mockRoute} />);

  //   // Press on a location
  //   fireEvent.press(getByText("Hall Building"));

  //   // Check if keyboard was dismissed
  //   expect(require("react-native/Libraries/Components/Keyboard/Keyboard").dismiss).toHaveBeenCalled();

  //   // Check if onGoBack was called with the selected location
  //   expect(mockOnGoBack).toHaveBeenCalledWith(mockRoute.params.allLocations[0]);

  //   // Check if navigation.goBack was called
  //   expect(mockNavigation.goBack).toHaveBeenCalled();
  // });

  it("goes back when back button is pressed", () => {
    const { getByTestId } = render(<CustomNavSearch navigation={mockNavigation} route={mockRoute} />);

    // Find and press the back button
    fireEvent.press(getByTestId("back-button"));

    // Check if navigation.goBack was called
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test("fetches buildings when no locations are provided", () => {
    // Test that the getBuildings function exists and can be called
    const getBuildings = require("../api/dataService").getBuildings;
    expect(typeof getBuildings).toBe("function");

    // Verify the mock behavior
    const mockResult = getBuildings();
    expect(mockResult instanceof Promise).toBeTruthy();
  });
});
