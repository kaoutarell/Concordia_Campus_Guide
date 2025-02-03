import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import locationService from "../services/LocationService.js";
// Get screen width and height dynamically
const { width, height } = Dimensions.get("window");

const MapViewComponent = ({ locations, region }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        if (locations.length > 0) {
            setIsLoading(false);
        }
    }, [locations]);
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                await locationService.startTrackingLocation();
                const location = locationService.getCurrentLocation();
                setCurrentLocation(location);
            } catch (error) {
                console.log("Error fetching location:", error);
            }
        };
        fetchLocation();

        return () => {
            locationService.stopTrackingLocation();
        };
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            {/* Loading Indicator */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                    <Text style={styles.loadingText}>Loading locations...</Text>
                </View>
            ) : (
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    {/* Markers for locations */}
                    {locations.map((location) => (
                        <Marker
                            key={location.id}
                            coordinate={{
                                latitude: location.location.latitude,
                                longitude: location.location.longitude,
                            }}
                            description="Description"
                            title={location.name}
                            pinColor="red"

                        />

                    ))}
                    {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            }}
                            title="Current Location"
                            pinColor="blue"
                        />
                    )}
                </MapView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Avoids overlapping with status bar
    },
    map: {
        flex: 1, // Takes full available space
        width: "100%", // Ensures full width
        height: "100%", // Ensures full height
    },
    loadingContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MapViewComponent;
