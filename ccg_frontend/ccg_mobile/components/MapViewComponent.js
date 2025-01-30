import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Get screen width and height dynamically
const { width, height } = Dimensions.get("window");

const MapViewComponent = ({ locations, initialRegion }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (locations.length > 0) {
            setIsLoading(false);
        }
    }, [locations]);

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
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                >
                    {/* Markers for locations */}
                    {locations.map((location) => (
                        <Marker
                            key={location.id}
                            coordinate={{
                                latitude: location.location.latitude,
                                longitude: location.location.longitude,
                            }}
                            title={location.name}
                            pinColor="red"
                        />
                    ))}
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
