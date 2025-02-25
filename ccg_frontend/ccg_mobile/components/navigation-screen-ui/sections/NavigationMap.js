import React, { useRef, useEffect, useMemo, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { getMyCurrentLocation } from "../../../utils/defaultLocations";
import BusMarker from "../../../assets/bus-marker.png";

const convertCoordinate = (cord) => ({
    latitude: cord[1],
    longitude: cord[0],
});

const convertCoordinates = (coordinatesArray) =>
    coordinatesArray.map(convertCoordinate);

const NavigationMap = ({
    start,
    destination,
    bbox,
    pathCoordinates,
    legs,
    isNavigating,

    displayShuttle = false,
}) => {
    const mapRef = useRef(null);

    const fallbackCoordinates = useMemo(() => {
        if (!pathCoordinates) return [];
        return pathCoordinates.flatMap((element) =>
            convertCoordinates(element.coordinates)
        );
    }, [pathCoordinates]);

    useEffect(() => {
        const updateRegion = async () => {
            if (isNavigating) {
                const currentLocation = await getMyCurrentLocation();
                const region = {
                    latitude: currentLocation.location.latitude,
                    longitude: currentLocation.location.longitude,
                    latitudeDelta: 0.001,   // Zoom level - adjust as needed
                    longitudeDelta: 0.001,
                };

                if (mapRef.current) {
                    mapRef.current.animateToRegion(region, 1000);
                }
            }
        };

        updateRegion();
    }, [isNavigating]);

    const allCoordinates = useMemo(() => {
        if (displayShuttle && legs) {
            return Object.values(legs).reduce((acc, leg) => {
                if (leg.steps && Array.isArray(leg.steps)) {
                    leg.steps.forEach((step) => {
                        if (step.coordinates && Array.isArray(step.coordinates)) {
                            const stepPoints = convertCoordinates(step.coordinates);
                            acc = acc.concat(stepPoints);
                        }
                    });
                }
                return acc;
            }, []);
        }
        return fallbackCoordinates;
    }, [legs, displayShuttle, fallbackCoordinates]);

    const region = useMemo(
        () => ({
            latitude: (bbox[1] + bbox[3]) / 2,
            longitude: (bbox[0] + bbox[2]) / 2,
            latitudeDelta: Math.abs(bbox[3] - bbox[1]) * 1.2,
            longitudeDelta: Math.abs(bbox[2] - bbox[0]) * 1.2,
        }),
        [bbox]
    );
    const startMarker = {
        latitude: start?.location?.latitude,
        longitude: start?.location?.longitude,
    };
    const endMarker = {
        latitude: destination?.location?.latitude,
        longitude: destination?.location?.longitude,
    };

    const startTitle = displayShuttle
        ? start?.campus || "Start"
        : start?.building_code;
    const endTitle = displayShuttle
        ? destination?.campus || "End"
        : destination?.building_code;

    const intermediateMarkers = useMemo(() => {
        if (!legs || !displayShuttle) return [];

        const legsArray = Object.values(legs).filter(
            (leg) => leg.total_distance !== 0
        );
        if (legsArray.length === 0) return [];

        const markers = [];

        // Get the first leg's end coordinate.
        const firstLeg = legsArray[0];
        if (firstLeg.steps && firstLeg.steps.length > 0) {
            const firstLegLastStep = firstLeg.steps[firstLeg.steps.length - 1];
            const endCoord = firstLegLastStep.coordinates?.slice(-1)[0];
            if (endCoord) {
                markers.push({
                    ...convertCoordinate(endCoord),
                    title: "First Leg End",
                });
            }
        }

        // Get the last leg's beginning coordinate.
        const lastLeg = legsArray[legsArray.length - 1];
        if (lastLeg.steps && lastLeg.steps.length > 0) {
            const lastLegFirstStep = lastLeg.steps[0];
            const startCoord = lastLegFirstStep.coordinates?.[0];
            if (startCoord) {
                markers.push({
                    ...convertCoordinate(startCoord),
                    title: "Last Leg Start",
                });
            }
        }

        return markers;
    }, [legs, displayShuttle]);

    return (
        <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}

            region={{
                latitude: (bbox[1] + bbox[3]) / 2,
                longitude: (bbox[0] + bbox[2]) / 2,
                latitudeDelta: Math.abs(bbox[3] - bbox[1]) * 1.2,  // Add some padding
                longitudeDelta: Math.abs(bbox[2] - bbox[0]) * 1.2, // Add some padding
            }}

        >
            <Marker
                coordinate={{
                    latitude: start?.location?.latitude,
                    longitude: start?.location?.longitude,
                }}
                title={start?.building_code}
                pinColor="blue"
            />
            <Marker
                coordinate={{
                    latitude: destination?.location?.latitude,
                    longitude: destination?.location?.longitude,
                }}
                title={destination?.building_code}
                pinColor="red"
            />
            <Polyline
                coordinates={allCoordinates}
                strokeColor="navy"
                strokeWidth={3}
            />
        </MapView>
    );
};

const BusTrackingMarkers = ({ shuttleLocations, displayShuttle }) => {
    if (!shuttleLocations || !displayShuttle) return null;

    return (
        <>
            {shuttleLocations.map((bus) => (
                <Marker
                    key={bus.id}
                    coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
                    title={`Shuttle ${bus.id}`}
                    pinColor="red"
                    image={BusMarker}
                />
            ))}
        </>
    );
};

BusTrackingMarkers.propTypes = {
    shuttleLocations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        })
    ),
    displayShuttle: PropTypes.bool,
};

NavigationMap.propTypes = {
    start: PropTypes.shape({
        location: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        }).isRequired,
        campus: PropTypes.string,
        building_code: PropTypes.string,
    }).isRequired,
    destination: PropTypes.shape({
        location: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        }).isRequired,
        campus: PropTypes.string,
        building_code: PropTypes.string,
    }).isRequired,
    bbox: PropTypes.arrayOf(PropTypes.number).isRequired,
    pathCoordinates: PropTypes.arrayOf(
        PropTypes.shape({
            coordinates: PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.number)
            ).isRequired,
        })
    ),
    legs: PropTypes.object,
    shuttleLocations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        })
    ),
    isNavigating: PropTypes.bool,
    displayShuttle: PropTypes.bool,
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
})

export default NavigationMap;