import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import NavigationModes from '../components/navigation/NavigationModes';
import NavigationInfo from '../components/navigation/NavigationInfo';

const NavigationScreen = ({ navigation, route }) => {
    const startPoint = route.params.start;
    const destinationPoint = route.params.destination;

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
                <MapView style={styles.map} />
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