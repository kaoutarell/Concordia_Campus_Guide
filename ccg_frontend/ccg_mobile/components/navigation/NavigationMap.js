import React, { useState, useEffect} from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";

const SGW_STOP = { latitude: 45.497129019513835, longitude: -73.57852460612132 };
const LOYOLA_STOP = { latitude: 45.45841608855384, longitude: -73.63828201677715 };

const NavigationMap = ({start, destination, pathCoordinates, busLocations, isShuttle = false})=>{
    const region = {
        latitude: (start.latitude + destination.latitude) / 2,
        longitude: (start.longitude + destination.longitude) / 2,
        latitudeDelta: Math.abs(start.latitude - destination.latitude) * 2,
        longitudeDelta: Math.abs(start.longitude - destination.longitude) * 2,
    };
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
            region={region}
        >
            <Marker
                coordinate={ isShuttle ?
                    {
                        latitude: SGW_STOP.latitude,
                        longitude: SGW_STOP.longitude,
                    }
                    :
                    {
                        latitude: start.location.latitude,
                        longitude: start.location.longitude,
                    }
            }
                title={isShuttle ? 'SGW' : start.building_code}
                pinColor="red"
            />
            <Marker
                coordinate={ isShuttle ?
                    {
                        latitude: LOYOLA_STOP.latitude,
                        longitude: LOYOLA_STOP.longitude,
                    }
                    :
                    {
                        latitude: destination.location.latitude,
                        longitude: destination.location.longitude,
                    }
                }
                title={isShuttle ? 'LOY' : destination.building_code}
                pinColor="red"
            />
            <Polyline
                coordinates={coordinates}
                strokeColor="navy"
                strokeWidth={3}
            />
            {busLocations && isShuttle &&
                busLocations.map((bus) => (
                    <Marker
                        key={bus.id}
                        coordinate={{
                            latitude: bus.latitude,
                            longitude: bus.longitude,
                        }}
                        title={`Shuttle ${bus.id}`}
                        pinColor="red"
                        image={require("../../assets/bus-marker.png")}
                    />
                ))}
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