import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import NavigationModes from "../components/navigation/NavigationModes";
import NavigationInfo from "../components/navigation/NavigationInfo";
import NavigationMap from "../components/navigation/NavigationMap";
import { getDirections } from "../api/dataService";
import busLocationService from "../services/BusLocationService";
import {LOYOLA_STOP, SGW_STOP} from "../constants";
import BusNavigationInfo from "../components/navigation/BusNavigationInfo";


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
                Bicycle: "cycling-regular",
                Driving: "driving-car",
                "Public Transport": "public-transport",
                'Concordia Shuttle': "concordia-shuttle",
            };
            const modeParam = modeMapping[selectedMode] || "foot-walking"; // to be used once direction api is done
            const start = selectedMode === "Concordia Shuttle" ? [SGW_STOP.longitude, SGW_STOP.latitude] : [startPoint.location.longitude, startPoint.location.latitude];
            const destination = selectedMode === "Concordia Shuttle" ? [LOYOLA_STOP.longitude, LOYOLA_STOP.latitude] : [destinationPoint.location.longitude, destinationPoint.location.latitude];
            const data = await getDirections(
                "foot-walking",
                start,
                destination
            );
            setDirection(data);
        } catch (error) {
            console.error("Error fetching direction data: ", error);
        }
    };

    useEffect(() => {
        setDirection(null);
        fetchDirections();
    }, [startPoint, destinationPoint, selectedMode]);

    useEffect(() => {
        if (selectedMode === "Concordia Shuttle") {
            busLocationService.startTracking(500);
            const interval = setInterval(() => {
                setBusLocations(busLocationService.getBusLocations());
            }, 500);
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
                        ? "SGW Shuttle Stop"
                        : startPoint?.civic_address
                }
                destinationAddress={
                    selectedMode === "Concordia Shuttle"
                        ? "LOY Shuttle Stop"
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
            {direction && selectedMode === "Concordia Shuttle" ? (
                <BusNavigationInfo
                    totalDistance={direction.total_distance}
                    totalDuration={direction.total_duration}
                />
            ) : direction ? (
                <NavigationInfo
                    totalDistance={direction.total_distance}
                    totalDuration={direction.total_duration}
                    onStartNavigation={() => {}}
                />
            ) : null}
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