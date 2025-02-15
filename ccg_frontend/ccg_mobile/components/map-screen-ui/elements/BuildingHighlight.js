import React from "react";
import { Geojson, Polygon } from "react-native-maps";
import SGWCoord from "../../../constants/sgwGeoJson.json";
import LOYCoord from "../../../constants/loyGeoJson.json";
// import { store } from "../../../redux/reducers";
import uuid from "react-native-uuid";

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
        key={uuid.v4()}
        geojson={coords}
        strokeColor="#5a6366"
        fillColor="#b5e7ec"
        strokeWidth={1}
        zIndex={2}
      />
    );
};

export default BuildingHighlight;
