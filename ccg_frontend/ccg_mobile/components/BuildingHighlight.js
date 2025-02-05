import React from "react";
import {Polygon} from "react-native-maps";
import SGWCoord from "../constants/sgwGeoJson.json";
import LOYCoord from "../constants/loyGeoJson.json";
import {store} from "../redux/reducers";
import uuid from 'react-native-uuid';

const BuildingHighlight = () => {
    return store.getState().isSGW ? renderSGWBuidlings() : renderLOYBuidlings();
};

const renderSGWBuidlings = () => {
    return (
        SGWCoord.features.map((building) => {
            return (
                <Polygon
                    key={uuid.v4()}
                    coordinates={
                        building.geometry.coordinates.map((coord) => {
                            return {
                                latitude: coord[1],
                                longitude: coord[0],
                            };
                        })}
                    strokeColor="#5a6366"
                    fillColor="#b5e7ec"
                    strokeWidth={1}
                />
            );
        })
    );
};

const renderLOYBuidlings = () => {
    return (
        LOYCoord.features.map((building) => {
            return (
                <Polygon
                    key={uuid.v4()}
                    coordinates={
                        building.geometry.coordinates.map((coord) => {
                            return {
                                latitude: coord[1],
                                longitude: coord[0],
                            };
                        })}
                    strokeColor="#5a6366"
                    fillColor="#b5e7ec"
                    strokeWidth={1}
                />
            );
        })
    );
}

export default BuildingHighlight;
