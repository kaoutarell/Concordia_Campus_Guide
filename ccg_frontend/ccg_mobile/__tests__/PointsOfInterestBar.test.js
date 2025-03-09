import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PointsOfInterestBar from "../components/map-screen-ui/sections/PointsOfInterestBar";
import { getPointOfInterests } from "../api/dataService.js";
import locationService from "../services/LocationService.js";

jest.mock("../api/dataService", () => ({
  getPointOfInterests: jest.fn(),
}));

jest.mock("../services/LocationService", () => ({
  getCurrentLocation: jest.fn(() => ({
    coords: { longitude: -73.5673, latitude: 45.5017 },
  })),
}));

describe("PointsOfInterestBar", () => {
  const mockSetSelectedPointOfInterest = jest.fn();
  const defaultCampus = "SGW";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(<PointsOfInterestBar campus={defaultCampus} setSelectedPointOfInterest={mockSetSelectedPointOfInterest} />);

  it("fetches locations when the Restaurants button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Restaurant" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Restaurants"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Restaurant" }]);
    });
  });

  it("fetches locations when the Coffee button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Coffee Shop" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Coffee"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("cafe", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Coffee Shop" }]);
    });
  });

  it("fetches locations when the Fast Food button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Fast Food Place" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Fast Food"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("fast_food", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Fast Food Place" }]);
    });
  });

  it("fetches locations when the Library button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Library" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Library"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("library", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Library" }]);
    });
  });

  it("fetches locations when the ATM button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test ATM" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("ATM"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("atm", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test ATM" }]);
    });
  });

  it("fetches locations when the Clinic button is pressed", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Clinic" }]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Clinic"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("clinic", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Clinic" }]);
    });
  });

  it("returns empty data when a POI button is pressed and no locations are found", async () => {
    getPointOfInterests.mockResolvedValue([]);

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Restaurants"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([]);
    });
  });

  it("logs an error when fetching locations fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {}); //console.error
    getPointOfInterests.mockRejectedValue(new Error("Network error")); // Simulate API failure

    const { getByText } = renderComponent();
    fireEvent.press(getByText("Restaurants"));

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching locations: ", expect.any(Error)); // Verify error log
    });

    consoleErrorSpy.mockRestore(); // Restore console.error after the test
  });

  it("toggles selection when the same POI button is pressed twice", async () => {
    getPointOfInterests.mockResolvedValue([{ name: "Test Restaurant" }]);

    const { getByText } = renderComponent();
    const button = getByText("Restaurants");

    fireEvent.press(button);

    await waitFor(() => {
      expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", defaultCampus, -73.5673, 45.5017);
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Restaurant" }]);
    });

    // Deselect the same button
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSetSelectedPointOfInterest).toHaveBeenCalledWith([]);
    });
  });
});
