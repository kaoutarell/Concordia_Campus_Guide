import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import NavigationModes from '../components/navigation/NavigationModes';
import NavigationInfo from '../components/navigation/NavigationInfo';

const NavigationScreen = ({ navigation, route }) => {
    // Données bidons pour les coordonnées
    const startPoint = {
        coordinates: {
            latitude: 48.8566,  // Paris
            longitude: 2.3522
        },
        civic_address: "Paris, France"
    };
    const destinationPoint = {
        coordinates: {
            latitude: 51.5074,  // Londres
            longitude: -0.1278
        },
        civic_address: "London, United Kingdom"
    };

    const startLatitude = startPoint.coordinates.latitude;
    const startLongitude = startPoint.coordinates.longitude;
    const destinationLatitude = destinationPoint.coordinates.latitude;
    const destinationLongitude = destinationPoint.coordinates.longitude;

    return (
        <View style={styles.container}>
            {/* Header Section (NavigationModes) */}
            <NavigationModes 
                startAddress={startPoint.civic_address} 
                destinationAddress={destinationPoint.civic_address} 
                onBackPress={() => navigation.goBack()}
            />

            {/* Map Container (Center) */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: startLatitude,
                        longitude: startLongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Marqueur de départ */}
                    <Marker coordinate={{ latitude: startLatitude, longitude: startLongitude }} title="Point de départ" description={startPoint.civic_address} />

                    {/* Marqueur de destination */}
                    <Marker coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }} title="Destination" description={destinationPoint.civic_address} />
                </MapView>
            </View>

            {/* Footer Section (NavigationInfo) */}
            <NavigationInfo />
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
