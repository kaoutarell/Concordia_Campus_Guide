import React from "react";
import { render } from "@testing-library/react-native";
import BuildingHighlight from "../components/map-screen-ui/elements/BuildingHighlight";

// Mocking react-native-maps Polygon component
jest.mock("react-native-maps", () => ({
  Geojson: "Geojson", // Simple mock for Polygon component
}));

// Mocking UUID to return a predictable value
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "1234-uuid"),
}));

// Mocking the geoJson data (SGWCoord and LOYCoord)
jest.mock("../constants/concordiaGeoJson.json", () => ({
  features: [
    {
      geometry: {
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
    },
    {
      geometry: {
        coordinates: [
          [2, 2],
          [3, 3],
        ],
      },
    },
  ],
}));


describe("BuildingHighlight", () => {
  it("renders geojson for SGW and LOY", () => {

    const { getAllByTestId } = render(<BuildingHighlight />);

    // Ensure multiple Polygon components are rendered
    const geojson = getAllByTestId("geojson");
    expect(geojson.length).toBeGreaterThan(0);
  });
});
