import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar, ActivityIndicator, Text } from 'react-native';
import NavigationFooter from './sections/NavigationFooter';
import NavigationMap from './sections/NavigationMap';
import { getDirections } from '../../api/dataService';

import NavigationHeader from "./sections/NavigationHeader";
import NavigationDirection from "./sections/NavigationDirection";
import NavigationInfos from "./sections/NavigationInfos";

import locationService from "../../services/LocationService";

import { useRouteInstruction } from "../../hooks/useRouteInstruction";


import { getMyCurrentLocation, getDefaultDestination } from "../../utils/defaultLocations";

const NavigationScreen = ({ navigation, route }) => {

    const params = route.params || {};

    const [startPoint, setStartPoint] = useState(params.start || null);

    const [destinationPoint, setDestinationPoint] = useState(params.destination || null);

    const [direction, setDirection] = useState(null);

    const [selectedMode, setSelectedMode] = useState("foot-walking");

    const [loading, setLoading] = useState(true);

    const [isNavigating, setIsNavigating] = useState(false);

    const [searchText, setSearchText] = useState({
        startAddress: "",
        destinationAddress: ""
    });

    const [userLocation, setUserLocation] = useState(null);


    useEffect(() => {
        if (startPoint != null && destinationPoint != null)
            fetchDirections();
        else
            setDefaultStartAndDestination();
    }, [startPoint, destinationPoint, selectedMode, isNavigating]);

    useEffect(() => {
        // Start tracking location using the service
        locationService.startTrackingLocation().catch((err) => {
            setErrorMsg(err.message);
        });

        // Subscribe to location updates
        const handleLocationUpdate = (location) => {
            setUserLocation([location.coords.longitude, location.coords.latitude]);
        };

        locationService.subscribe(handleLocationUpdate);

        // Clean up on unmount: unsubscribe and stop tracking
        return () => {
            locationService.unsubscribe(handleLocationUpdate);
            locationService.stopTrackingLocation();
        };
    }, []);


    const { instruction, distance } = useRouteInstruction(direction, userLocation);


    const onSelectedMode = (mode) => {
        setSelectedMode(mode);
    };

    // needs to check destination point but we need to implement the search bar first
    const startNavigation = async () => {
        // when navigating, set the start point to the current location
        const currentLocation = await getMyCurrentLocation();
        setStartPoint(currentLocation);
        setIsNavigating(true);
    }


    const onExitNavigation = () => {
        setIsNavigating(false);
    }

    const fetchDirections = async () => {

        setLoading(true);
        try {
            const data = await getDirections(
                selectedMode,
                [startPoint?.location.longitude, startPoint?.location.latitude],
                [destinationPoint?.location.longitude, destinationPoint?.location.latitude]
            );



            setDirection(data);
            setSearchText({
                startAddress: startPoint?.civic_address,
                destinationAddress: destinationPoint?.civic_address
            });
            setLoading(false);

        } catch (error) {
            setDirection([]);
            console.error("Error fetching: ", error);
        }

    };

    const setDefaultStartAndDestination = async () => {
        try {

            let currentLocation;
            let defaultDestination;
            if (startPoint == null) {
                currentLocation = await getMyCurrentLocation();
                setStartPoint(currentLocation);
                setSearchText(prev => ({
                    ...prev,
                    startAddress: currentLocation.civic_address
                }));
            }
            if (destinationPoint == null) {
                defaultDestination = getDefaultDestination();
                setDestinationPoint(defaultDestination);
                setSearchText(prev => ({
                    ...prev,
                    destinationAddress: defaultDestination.civic_address
                }));
            }


        } catch (error) {
            console.error("Error setting default location: ", error);
        }

    };

    const onStartSearching = (text) => {

        if (text.startAddress !== undefined) {
            setSearchText((prev) => ({
                ...prev,
                startAddress: text.startAddress,
            }));
        } else if (text.destinationAddress !== undefined) {
            setSearchText((prev) => ({
                ...prev,
                destinationAddress: text.destinationAddress,
            }));
        }

    };



    return (
        <View style={styles.container}>

            {!isNavigating ?
                (<NavigationHeader
                    startAddress={searchText.startAddress}
                    destinationAddress={searchText.destinationAddress}
                    onSelectedMode={onSelectedMode}
                    onBackPress={() => navigation.goBack()}
                    selectedMode={selectedMode}
                    onStartSearching={onStartSearching}
                />) :
                (
                    <NavigationDirection
                        distance={distance}
                        instruction={instruction}
                    />
                )}
            {/* Map Container (Center) */}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                    <Text style={styles.loadingText}>Loading locations...</Text>
                </View>
            ) :
                (
                    <View style={styles.mapContainer(isNavigating)}>
                        {direction != null &&
                            <NavigationMap start={startPoint}
                                destination={destinationPoint}
                                pathCoordinates={direction.steps}
                                bbox={direction.bbox}
                                isNavigating={isNavigating}
                            />}
                    </View>
                )}

            {!isNavigating ?

                (
                    <NavigationFooter
                        totalDistance={direction?.total_distance}
                        totalDuration={direction?.total_duration}
                        onStartNavigation={startNavigation} />
                )
                :
                (
                    <NavigationInfos
                        totalDistance={direction?.total_distance}
                        totalDuration={direction?.total_duration}
                        onExit={onExitNavigation}
                    />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    mapContainer: (isNavigating) => ({
        height: isNavigating ? '70%' : '60%', // Dynamic height based on isNavigating
        width: '100%',
    }),
    map: {
        flex: 1,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default NavigationScreen;