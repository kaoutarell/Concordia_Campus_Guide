import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import IndoorNavigationScreen from "../components/indoor-navigation-ui/IndoorNavigationScreen";
import { getBuildings, getIndoorDirections } from "../api/dataService";
import IndoorNavigationHeader from "../components/indoor-navigation-ui/sections/IndoorNavigationHeader";
import IndoorMap from "../components/indoor-navigation-ui/sections/IndoorMap";
import IndoorNavigationFooter from "../components/indoor-navigation-ui/sections/IndoorNavigationFooter";

// Mock the API functions
jest.mock("../api/dataService", () => ({
  getBuildings: jest.fn(),
  getIndoorDirections: jest.fn(),
}));

// Mock child components
jest.mock("../components/indoor-navigation-ui/sections/IndoorNavigationHeader", () => jest.fn(() => null));
jest.mock("../components/indoor-navigation-ui/sections/IndoorMap", () => jest.fn(() => null));
jest.mock("../components/indoor-navigation-ui/sections/IndoorNavigationFooter", () => jest.fn(() => null));

describe("IndoorNavigationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId } = render(<IndoorNavigationScreen />);
    expect(getByTestId("indoor-navigation-screen")).toBeTruthy();
  });

  it("fetches buildings and sets default building on mount", async () => {
    const mockBuildings = [
      { id: "1", name: "Henry F. Hall Building" },
      { id: "2", name: "John Molson Building" },
    ];
    getBuildings.mockResolvedValue(mockBuildings);

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
      expect(IndoorNavigationHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          buildings: [
            { label: "Henry F. Hall Building", value: "1" },
            { label: "John Molson Building", value: "2" },
          ],
          selectedBuilding: "1", // Default building is set (not 0)
        }),
        expect.anything()
      );
    });
  });

  it("handles building change", async () => {
    const mockBuildings = [
      { id: "1", name: "Henry F. Hall Building" },
      { id: "2", name: "John Molson Building" },
    ];
    getBuildings.mockResolvedValue(mockBuildings);

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
    });

    // Simulate building change
    const newBuildingValue = "2";
    await act(async () => {
      IndoorNavigationHeader.mock.calls[0][0].onBuildingChange(newBuildingValue);
    });

    expect(IndoorNavigationHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedBuilding: newBuildingValue,
      }),
      expect.anything()
    );
  });

  it("handles start location and destination change", async () => {
    const mockBuildings = [{ id: "1", name: "Henry F. Hall Building" }];
    getBuildings.mockResolvedValue(mockBuildings);

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
    });

    // Simulate start location change
    const newStartLocation = "Room 101";
    await act(async () => {
      IndoorNavigationHeader.mock.calls[0][0].onStartLocationChange(newStartLocation);
    });

    expect(IndoorNavigationHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        startLocation: newStartLocation,
      }),
      expect.anything()
    );

    // Simulate destination change
    const newDestination = "Room 202";
    await act(async () => {
      IndoorNavigationHeader.mock.calls[0][0].onDestinationChange(newDestination);
    });

    expect(IndoorNavigationHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: newDestination,
      }),
      expect.anything()
    );
  });

  it("handles showing directions when start and destination are provided", async () => {
    const mockBuildings = [{ id: "1", name: "Henry F. Hall Building" }];
    const mockPath = { steps: ["Step 1", "Step 2"] };
    getBuildings.mockResolvedValue(mockBuildings);
    getIndoorDirections.mockResolvedValue(mockPath);

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
    });

    // Set start and destination
    const startLocation = "Room 101";
    const destination = "Room 202";
    await act(async () => {
      IndoorNavigationHeader.mock.calls[0][0].onStartLocationChange(startLocation);
      IndoorNavigationHeader.mock.calls[0][0].onDestinationChange(destination);
    });

    // Simulate showing directions
    await act(async () => {
      IndoorNavigationFooter.mock.calls[0][0].onShowDirections(startLocation, destination);
    });

    await waitFor(() => {
      expect(getIndoorDirections).toHaveBeenCalledWith(false, startLocation, destination);
      expect(IndoorMap).toHaveBeenCalledWith(
        expect.objectContaining({
          path: mockPath,
        }),
        expect.anything()
      );
    });
  });

  it("does not fetch directions if start or destination is missing", async () => {
    const mockBuildings = [{ id: "1", name: "Henry F. Hall Building" }];
    getBuildings.mockResolvedValue(mockBuildings);

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
    });

    // Simulate showing directions without start or destination
    await act(async () => {
      IndoorNavigationFooter.mock.calls[0][0].onShowDirections("", "Room 202");
    });

    await waitFor(() => {
      expect(getIndoorDirections).not.toHaveBeenCalled();
    });
  });

  it("handles API errors when fetching buildings", async () => {
    getBuildings.mockRejectedValue(new Error("Failed to fetch buildings"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching buildings:", expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it("handles API errors when fetching directions", async () => {
    const mockBuildings = [{ id: "1", name: "Henry F. Hall Building" }];
    getBuildings.mockResolvedValue(mockBuildings);
    getIndoorDirections.mockRejectedValue(new Error("Failed to fetch directions"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<IndoorNavigationScreen />);

    await waitFor(() => {
      expect(getBuildings).toHaveBeenCalledTimes(1);
    });

    // Set start and destination
    const startLocation = "Room 101";
    const destination = "Room 202";
    await act(async () => {
      IndoorNavigationHeader.mock.calls[0][0].onStartLocationChange(startLocation);
      IndoorNavigationHeader.mock.calls[0][0].onDestinationChange(destination);
    });

    // Simulate showing directions
    await act(async () => {
      IndoorNavigationFooter.mock.calls[0][0].onShowDirections(startLocation, destination);
    });

    await waitFor(() => {
      expect(getIndoorDirections).toHaveBeenCalledWith(false, startLocation, destination);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching path:", expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
