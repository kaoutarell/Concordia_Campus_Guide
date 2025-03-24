import React from "react";
import { Geojson } from "react-native-maps";
import concordiaGeoJson from "../../../constants/concordiaGeoJson.json";
import locationService from "../../../services/LocationService";
import * as turf from "@turf/turf";

const buildingUserLocatedIn = (lat, lon, geojson, bufferMeters = 5) => {
  const point = turf.point([lon, lat]); // Turf uses [longitude, latitude]

  for (let feature of geojson.features) {
    const polygon = turf.polygon(feature.geometry.coordinates);

    // Create a buffer around the polygon (5 meters)
    const bufferedPolygon = turf.buffer(polygon, bufferMeters, { units: "meters" });

    // Check if the point is inside the buffered polygon
    if (turf.booleanPointInPolygon(point, bufferedPolygon)) {
      return `{"type": "FeatureCollection","features": [${JSON.stringify(feature)}]}`;
    }
  }
  return null; // Not inside any polygon
};

const BuildingHighlight = () => {
  // Get user location
  const user_loc = locationService.getCurrentLocation();
  let currentBuilding;
  if (user_loc) {
    currentBuilding = buildingUserLocatedIn(user_loc.coords.latitude, user_loc.coords.longitude, concordiaGeoJson);
  } else {
    currentBuilding = null;
  }

  return (
    <>
      <Geojson
        testID="geojson"
        geojson={concordiaGeoJson}
        strokeColor="#5a6366"
        fillColor="#d3d3d3"
        strokeWidth={1}
        zIndex={100}
      />
      {currentBuilding && (
        <Geojson
          testID="geojson"
          geojson={JSON.parse(currentBuilding)}
          strokeColor="#5a6366"
          fillColor="#b5e7ec"
          strokeWidth={1}
          zIndex={100}
        />
      )}
    </>
  );
};

export default BuildingHighlight;
