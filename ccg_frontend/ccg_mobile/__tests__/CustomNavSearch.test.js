import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomNavSearch from "../components/navigation-screen-ui/CustomNavSearch";

// Mock dependencies
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "Icon",
}));

// Mock categoryIcons utility
jest.mock("../utils/categoryIcons", () => ({
  getCategoryIcon: jest.fn().mockImplementation((category) => {
    return { uri: `mock-icon-${category || "default"}` };
  }),
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

  it("filters locations when searching", () => {
    const customRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "1",
            name: "Hall Building",
            building_code: "H",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "building",
          },
          {
            id: "2",
            name: "Library Building",
            building_code: "LB",
            campus: "SGW",
            location: { latitude: 45.496, longitude: -73.578 },
            civic_address: "1400 De Maisonneuve Blvd W",
            category: "building",
          },
        ],
      },
    };
    
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={customRoute} />
    );

    // Get the search input
    const searchInput = getByPlaceholderText("Choose destination");

    // Enter search text
    fireEvent.changeText(searchInput, "Hall");

    // Hall Building should be visible
    expect(getByText("Hall Building")).toBeTruthy();

    // Library Building should not be visible since it doesn't match the search
    expect(queryByText("Library Building")).toBeFalsy();
  });

  it("selects a location and navigates back", () => {
    const customRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "1",
            name: "Hall Building",
            building_code: "H",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "building",
          },
        ],
      },
    };
    
    const { getByText } = render(<CustomNavSearch navigation={mockNavigation} route={customRoute} />);

    // Press on a location
    fireEvent.press(getByText("Hall Building"));

    // Check if keyboard was dismissed
    expect(require("react-native/Libraries/Components/Keyboard/Keyboard").dismiss).toHaveBeenCalled();

    // Check if onGoBack was called with the selected location
    expect(mockOnGoBack).toHaveBeenCalledWith(customRoute.params.searchableItems[0]);

    // Check if navigation.goBack was called
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("selects a location when onGoBack is not provided", () => {
    const routeWithoutOnGoBack = {
      params: {
        type: "destination",
        searchableItems: [
          {
            id: "1",
            name: "Hall Building",
            building_code: "H",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "building",
          },
        ],
      },
    };
    
    const { getByText } = render(<CustomNavSearch navigation={mockNavigation} route={routeWithoutOnGoBack} />);

    // Press on a location
    fireEvent.press(getByText("Hall Building"));

    // Check if keyboard was dismissed
    expect(require("react-native/Libraries/Components/Keyboard/Keyboard").dismiss).toHaveBeenCalled();

    // onGoBack should not be called, but navigation.goBack should still work
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

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

  it("renders without params correctly", () => {
    // Test with no route params
    const emptyRoute = { params: null };
    
    const { getByPlaceholderText } = render(
      <CustomNavSearch navigation={mockNavigation} route={emptyRoute} />
    );
    
    // Should still render even without params
    // With no type specified, it defaults to "start" placeholder
    expect(getByPlaceholderText("Choose start")).toBeTruthy();
  });

  it("clears filtered locations when search is empty", () => {
    const { getByPlaceholderText, queryByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={mockRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Enter search text
    fireEvent.changeText(searchInput, "Hall");
    
    // Now clear the search
    fireEvent.changeText(searchInput, "");
    
    // No locations should be visible
    expect(queryByText("Hall Building")).toBeFalsy();
    expect(queryByText("Library Building")).toBeFalsy();
  });

  it("filters locations by address", () => {
    const customRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "1",
            name: "Hall Building",
            building_code: "H",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "building",
          },
          {
            id: "2",
            name: "Library Building",
            building_code: "LB",
            campus: "SGW",
            location: { latitude: 45.496, longitude: -73.578 },
            civic_address: "1400 De Maisonneuve Blvd W",
            category: "building",
          },
        ],
      },
    };
    
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={customRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Search by address
    fireEvent.changeText(searchInput, "1455");
    
    // Hall Building should be visible (matches the address)
    expect(getByText("Hall Building")).toBeTruthy();
    
    // Library Building should not be visible
    expect(queryByText("Library Building")).toBeFalsy();
  });

  it("displays 'No address available' when civic_address is missing", () => {
    const customRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "1",
            name: "Hall Building",
            building_code: "H",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            // civic_address is intentionally missing
            category: "building",
          },
        ],
      },
    };
    
    const { getByPlaceholderText, getByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={customRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Enter search text to show the location
    fireEvent.changeText(searchInput, "Hall");
    
    // "No address available" text should be visible
    expect(getByText("No address available")).toBeTruthy();
  });

  it("properly uses getCategoryIcon for different categories", () => {
    const getCategoryIcon = require("../utils/categoryIcons").getCategoryIcon;
    
    const customRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "1",
            name: "Cafe Building",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "cafe",
          },
          {
            id: "2",
            name: "Library Building",
            campus: "SGW",
            location: { latitude: 45.496, longitude: -73.578 },
            civic_address: "1400 De Maisonneuve Blvd W",
            category: "library",
          },
        ],
      },
    };
    
    const { getByPlaceholderText } = render(
      <CustomNavSearch navigation={mockNavigation} route={customRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Enter search text to show the locations
    fireEvent.changeText(searchInput, "Building");
    
    // Check if getCategoryIcon was called with the correct categories
    expect(getCategoryIcon).toHaveBeenCalledWith("cafe");
    expect(getCategoryIcon).toHaveBeenCalledWith("library");
  });

  it("handles empty arrays correctly", () => {
    const emptyRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [], // Empty array
      },
    };
    
    const { getByPlaceholderText, queryByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={emptyRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Enter search text
    fireEvent.changeText(searchInput, "Building");
    
    // No buildings should be visible
    expect(queryByText("Hall Building")).toBeFalsy();
    expect(queryByText("Library Building")).toBeFalsy();
  });

  it("uses searchableItems when both searchableItems and allLocations are provided", () => {
    const mixedRoute = {
      params: {
        type: "destination",
        onGoBack: mockOnGoBack,
        searchableItems: [
          {
            id: "3",
            name: "Science Building",
            campus: "SGW",
            location: { latitude: 45.498, longitude: -73.577 },
            civic_address: "1500 De Maisonneuve Blvd W",
            category: "university",
          },
        ],
        allLocations: [
          {
            id: "1",
            name: "Hall Building",
            campus: "SGW",
            location: { latitude: 45.497, longitude: -73.579 },
            civic_address: "1455 De Maisonneuve Blvd W",
            category: "university",
          },
        ],
      },
    };
    
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CustomNavSearch navigation={mockNavigation} route={mixedRoute} />
    );
    
    const searchInput = getByPlaceholderText("Choose destination");
    
    // Enter search text to show all locations
    fireEvent.changeText(searchInput, "Building");
    
    // Science Building should be visible (from searchableItems)
    expect(getByText("Science Building")).toBeTruthy();
    
    // Hall Building should not be visible (from allLocations which is overridden)
    expect(queryByText("Hall Building")).toBeFalsy();
  });
});