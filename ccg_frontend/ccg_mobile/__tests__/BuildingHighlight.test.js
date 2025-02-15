import React from "react";
import { render } from "@testing-library/react-native";
import BuildingHighlight from "../components/map-screen-ui/elements/BuildingHighlight";
import uuid from "react-native-uuid";

// Mocking react-native-maps Polygon component
jest.mock("react-native-maps", () => ({
  Geojson: "Geojson", // Simple mock for Polygon component
}));

// Mocking UUID to return a predictable value
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "1234-uuid"),
}));

// Mocking the geoJson data (SGWCoord and LOYCoord)
jest.mock("../constants/sgwGeoJson.json", () => ({
  features: [
    {
      geometry: {
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
    },
  ],
}));

jest.mock("../constants/loyGeoJson.json", () => ({
  features: [
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

  it("calls uuid.v4() at least once", () => {
    render(<BuildingHighlight />);

    // Ensure uuid.v4() was called at least once
    expect(uuid.v4).toHaveBeenCalled();
  });
});
