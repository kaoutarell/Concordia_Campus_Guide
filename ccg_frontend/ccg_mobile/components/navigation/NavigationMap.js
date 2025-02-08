import React, { useState, useEffect} from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";

const NavigationMap = ({start, destination, pathCoordinates})=>{
    let coordinates=[];
    pathCoordinates.forEach(element => {
        element.coordinates.forEach(cord =>{
            coordinates.push({
                latitude:cord[1],
                longitude:cord[0]
            })
        })
    });

    console.log(coordinates)

    return(
        <MapView
            style={style.map}
            showsUserLocation={true}
            region={{
                latitude: (start.location.latitude+destination.location.latitude)/2,
                longitude: (start.location.longitude+destination.location.longitude)/2,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
        >
            <Marker
                coordinate={{
                    latitude: start.location.latitude,
                    longitude: start.location.longitude,
                }}
                title={start.building_code}
                pinColor="red"
            />
            <Marker
                coordinate={{
                    latitude: destination.location.latitude,
                    longitude: destination.location.longitude,
                }}
                title={destination.building_code}
                pinColor="red"
            />
            <Polyline
                coordinates={coordinates}
                strokeColor="#000"
                strokeWidth={6}
            />
        </MapView>
    )
}

const style = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
})

export default NavigationMap;