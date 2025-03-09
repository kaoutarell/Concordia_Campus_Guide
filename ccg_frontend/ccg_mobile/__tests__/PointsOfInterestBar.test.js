import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PointsOfInterestBar from "../components/map-screen-ui/sections/PointsOfInterestBar";
import { getPointOfInterests } from "../api/dataService.js";
import locationService from "../services/LocationService.js";

jest.mock("../api/dataService", () => ({
  getPointOfInterests: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../services/LocationService", () => ({
  getCurrentLocation: jest.fn(() => ({
    coords: { longitude: -73.5673, latitude: 45.5017 },
  })),
}));

test("Clicking a POI button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Restaurant" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Restaurants");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Restaurant" }]);
  });
});

test("Clicking the Coffee button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Coffee Shop" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Coffee");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("cafe", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Coffee Shop" }]);
  });
});

test("Clicking the Fast Food button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Fast Food Place" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Fast Food");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("fast_food", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Fast Food Place" }]);
  });
});

test("Clicking the Library button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Library" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Library");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("library", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Library" }]);
  });
});

test("Clicking the ATM button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test ATM" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("ATM");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("atm", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test ATM" }]);
  });
});

test("Clicking the Clinic button fetches locations", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Clinic" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Clinic");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("clinic", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Clinic" }]);
  });
});

test("Clicking a POI button returns empty data", async () => {
  getPointOfInterests.mockResolvedValue([]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Restaurants");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([]);
  });
});

test("Clicking a POI button toggles selection", async () => {
  getPointOfInterests.mockResolvedValue([{ name: "Test Restaurant" }]);

  const setSelectedPointOfInterest = jest.fn();
  const { getByText } = render(
    <PointsOfInterestBar campus="SGW" setSelectedPointOfInterest={setSelectedPointOfInterest} />
  );

  const button = getByText("Restaurants");
  fireEvent.press(button);

  await waitFor(() => {
    expect(getPointOfInterests).toHaveBeenCalledWith("restaurant", "SGW", -73.5673, 45.5017);
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([{ name: "Test Restaurant" }]);
  });

  // Deselect the same button
  fireEvent.press(button);

  await waitFor(() => {
    expect(setSelectedPointOfInterest).toHaveBeenCalledWith([]);
  });
});
