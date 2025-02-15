import React from "react";
import { Geojson, Polygon } from "react-native-maps";
import SGWCoord from "../../../constants/sgwGeoJson.json";
import LOYCoord from "../../../constants/loyGeoJson.json";

const BuildingHighlight = () => {
  // console.log(SGWCoord);
  return (
    <>
      {renderGeoJsonPolygons(SGWCoord)}
      {renderGeoJsonPolygons(LOYCoord)}
    </>
  );
};

const renderGeoJsonPolygons = (coords) => {
    return (
      <Geojson
        testID="geojson"
        geojson={coords}
        strokeColor="#5a6366"
        fillColor="#b5e7ec"
        strokeWidth={1}
        zIndex={100}
      />
    );
};

export default BuildingHighlight;
