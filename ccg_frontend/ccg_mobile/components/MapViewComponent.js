import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get('window');

const MapViewComponent = ({ locations, initialRegion }) => {


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (locations.length > 0) {
            setIsLoading(false);
        }
    }, [locations]);

    return (
        <View style={styles.container}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: width,
        height: height,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapViewComponent;