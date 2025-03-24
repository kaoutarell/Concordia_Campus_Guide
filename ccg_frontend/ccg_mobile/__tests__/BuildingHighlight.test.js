import React from "react";
import { render } from "@testing-library/react-native";
import BuildingHighlight from "../components/map-screen-ui/elements/BuildingHighlight";
import * as turf from "@turf/turf";

// Mocking react-native-maps Polygon component
jest.mock("react-native-maps", () => ({
  Geojson: "Geojson", // Simple mock for Polygon component
}));

// Mocking UUID to return a predictable value
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "1234-uuid"),
}));

// Mocking location service
jest.mock("../services/LocationService", () => ({
  getCurrentLocation: jest.fn(() => ({
    coords: { latitude: 2.5, longitude: 2.5 }, // Inside second polygon in mock data
  })),
}));

jest.mock("../constants/concordiaGeoJson.json", () => ({
  features: [
    {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    },
    {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2, 2],
            [2, 3],
            [3, 3],
            [3, 2],
            [2, 2],
          ],
        ],
      },
    },
  ],
}));

describe("BuildingHighlight", () => {
  it("renders base geojson layer", () => {
    const { getAllByTestId } = render(<BuildingHighlight />);
    const geojsonLayers = getAllByTestId("geojson");
    expect(geojsonLayers.length).toBeGreaterThan(0);
  });

  it("renders highlighted building when user is inside one", () => {
    const { getAllByTestId } = render(<BuildingHighlight />);
    const geojsonLayers = getAllByTestId("geojson");
    
    // First layer is the base map, second should be the highlight
    expect(geojsonLayers.length).toBe(2);
  });

  it("returns null when user is not inside any building", () => {
    require("../services/LocationService").getCurrentLocation.mockImplementationOnce(() => ({
      coords: { latitude: 5, longitude: 5 }, // Outside all polygons
    }));
    const { getAllByTestId } = render(<BuildingHighlight />);
    const geojsonLayers = getAllByTestId("geojson");
    
    // Only the base layer should be rendered
    expect(geojsonLayers.length).toBe(1);
  });
});