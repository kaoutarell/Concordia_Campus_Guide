import React, {useState, useEffect, useRef} from "react";
import { View, StyleSheet, Platform, Button, StatusBar, ActivityIndicator, Text, Modal } from 'react-native';
import PropTypes from "prop-types";
import NavigationFooter from './sections/NavigationFooter';
import NavigationMap from './sections/NavigationMap';
import { getDirections } from '../../api/dataService';

import NavigationHeader from "./sections/NavigationHeader";
import NavigationDirection from "./sections/NavigationDirection";
import BusNavigationInfo from "./sections/BusNavigationInfo";
import NavigationInfos from "./sections/NavigationInfos";
import DirectionsList from "./sections/DirectionList";
import busLocationService from "../../services/BusLocationService";

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

    const [showDirections, setShowDirections] = useState(false);
    const [shuttleLocations, setShuttleLocations] = useState([]);

    const [userLocation, setUserLocation] = useState(null);
    const intervalRef = useRef(null);


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


    const handleModeSelect = (mode) => {
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

    useEffect(() => {
        if (selectedMode === "concordia-shuttle") {
            busLocationService.startTracking(2000);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setShuttleLocations(busLocationService.getBusLocations());
            }, 2000);
        }
        if (selectedMode !== "concordia-shuttle" && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        fetchDirections();

        return () => {
            if (selectedMode === "concordia-shuttle") {
                busLocationService.stopTracking();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [selectedMode]);

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

    const renderNavigationInfo = () => {
        return direction && selectedMode === "concordia-shuttle" ? (
            <BusNavigationInfo
                totalDistance={direction.total_distance}
                totalDuration={direction.total_duration}
            />
        ) : (
            <NavigationInfos
                totalDistance={direction?.total_distance}
                totalDuration={direction?.total_duration}
                onExit={onExitNavigation}
                onShowDirections={() => setShowDirections(true)}
            />
        );
    }

    return (
        <View style={styles.container}>

            <Modal
                visible={showDirections}
                animationType="slide"
                onRequestClose={() => setShowDirections(false)}
            >
                <View style={{ flex: 1 }}>
                    {/* Absolutely positioned button in the top-left corner */}
                    <View style={styles.closeButtonContainer}>
                        <Button title="←" onPress={() => setShowDirections(false)} />
                    </View>

                    <DirectionsList steps={direction?.steps} />
                </View>
            </Modal>

            {!isNavigating ?
                (<NavigationHeader
                    startAddress={searchText.startAddress}
                    destinationAddress={searchText.destinationAddress}
                    onSelectedMode={onSelectedMode}
                    onBackPress={() => navigation.goBack()}
                    selectedMode={handleModeSelect}

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
                                           legs={direction?.legs}
                                           displayShuttle={selectedMode === "concordia-shuttle"}
                                           shuttleLocations={shuttleLocations}
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
                    renderNavigationInfo()
                )
            }
        </View>
    );
};


NavigationScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.shape({
        params: PropTypes.shape({
            start: PropTypes.object,
            destination: PropTypes.object,
        }),
    }).isRequired,
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
        closeButtonContainer: {
            position: 'absolute',
            fontSize: 94,
            top: 50,     // adjust for your needs, or use SafeAreaView on iOS
            left: 16,
            zIndex: 999, // ensure the button stays on top of other content
        },
});

export default NavigationScreen;