import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import NavigationModes from "../components/navigation/NavigationModes";
import NavigationInfo from "../components/navigation/NavigationInfo";
import NavigationMap from "../components/navigation/NavigationMap";
import { getDirections } from "../api/dataService";
import busLocationService from "../services/BusLocationService";
import {BusNavigationInfo} from "../components/navigation/BusNavigationInfo";


const NavigationScreen = ({ navigation, route }) => {
    const startPoint = route.params.start;
    const destinationPoint = route.params.destination;
    const [selectedMode, setSelectedMode] = useState("Walking");
    const [direction, setDirection] = useState(null);
    const [busLocations, setBusLocations] = useState([]);

    const fetchDirections = async () => {
        try {
            const modeMapping = {
                Walking: "foot-walking",
                Bicycle: "cycling",
                Driving: "driving",
                "Public Transport": "transit",
                'Concordia Shuttle': "shuttle",
            };
            const modeParam = modeMapping[selectedMode] || "foot-walking";
            const data = await getDirections(
                modeParam,
                [startPoint.location.longitude, startPoint.location.latitude],
                [destinationPoint.location.longitude, destinationPoint.location.latitude]
            );
            setDirection(data);
        } catch (error) {
            console.error("Error fetching direction data: ", error);
        }
    };

    // When the selected mode changes (and is not shuttle), fetch directions, afterward we'll also fetch directions for shuttle
    useEffect(() => {
        if (selectedMode !== "Concordia Shuttle") {
            fetchDirections();
        }
    }, [startPoint, destinationPoint, selectedMode]);

    // When shuttle mode is selected, start live tracking of bus locations.
    useEffect(() => {
        if (selectedMode === "Concordia Shuttle") {
            busLocationService.startTracking(5000);
            const interval = setInterval(() => {
                setBusLocations(busLocationService.getBusLocations());
            }, 5000);
            return () => {
                busLocationService.stopTracking();
                clearInterval(interval);
            };
        }
    }, [selectedMode]);

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
    };

    return (
        <View style={styles.container}>
            <NavigationModes
                startAddress={
                    selectedMode === "Concordia Shuttle"
                        ? "Shuttle Bus SGW Stop"
                        : startPoint?.civic_address
                }
                destinationAddress={
                    selectedMode === "Concordia Shuttle"
                        ? "Shuttle Bus LOY Stop"
                        : destinationPoint?.civic_address
                }
                onModeChange={handleModeChange}
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.mapContainer}>
                { direction != null && (
                        <NavigationMap
                            start={startPoint}
                            destination={destinationPoint}
                            busLocations={busLocations}
                            pathCoordinates={direction.steps}
                            isShuttle={ selectedMode === "Concordia Shuttle" }
                        />
                    )
                }
            </View>
            {selectedMode === "Concordia Shuttle" ? (
                <BusNavigationInfo />
            ) : (
                direction != null && (
                    <NavigationInfo
                        totalDistance={direction.total_distance}
                        totalDuration={direction.total_duration}
                        onStartNavigation={() => {}}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Gérer le padding pour Android
    },
    mapContainer: {
        height: '58%', // Ajustez la hauteur de la carte selon vos besoins
        width: '100%',
    },
    map: {
        flex: 1, 
        width: '100%',
    },
});

export default NavigationScreen;