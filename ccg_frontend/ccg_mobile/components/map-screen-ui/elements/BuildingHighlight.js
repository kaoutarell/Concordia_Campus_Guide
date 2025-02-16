import React from "react";
import { Geojson } from "react-native-maps";
import concordiaGeoJson from "../../../constants/concordiaGeoJson.json";

const BuildingHighlight = () => {
  return (
    <Geojson
        testID="geojson"
        geojson={concordiaGeoJson}
        strokeColor="#5a6366"
        fillColor="#b5e7ec"
        strokeWidth={1}
        zIndex={100}
      />
  );
};

export default BuildingHighlight;
