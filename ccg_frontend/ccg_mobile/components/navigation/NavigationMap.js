import React, { useState, useEffect} from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";
import {LOYOLA_STOP, SGW_STOP} from "../../constants";
import Bus_Marker from "../../assets/bus-marker.png";

const NavigationMap = ({start, destination, pathCoordinates, busLocations, isShuttle = false})=>{
    const region = isShuttle ?
        {
            latitude: (SGW_STOP.latitude + LOYOLA_STOP.latitude) / 2,
            longitude: (SGW_STOP.longitude + LOYOLA_STOP.longitude) / 2,
            latitudeDelta: Math.abs(SGW_STOP.latitude - LOYOLA_STOP.latitude) * 2,
            longitudeDelta: Math.abs(SGW_STOP.longitude - LOYOLA_STOP.longitude) * 2,
        }
        :
        {
            latitude: (start.location.latitude + destination.location.latitude) / 2,
            longitude: (start.location.longitude + destination.location.longitude) / 2,
            latitudeDelta: Math.abs(start.location.latitude - destination.location.latitude) * 2,
            longitudeDelta: Math.abs(start.location.longitude - destination.location.longitude) * 2,
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
                        image={Bus_Marker}
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