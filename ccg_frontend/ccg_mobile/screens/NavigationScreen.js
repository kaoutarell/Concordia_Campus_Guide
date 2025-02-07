import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView from 'react-native-maps';

import NavigationModes from '../components/navigation/NavigationModes';
import NavigationInfo from '../components/navigation/NavigationInfo';
const NavigationScreen = ({ navigation, route }) => {
    const startPoint = route.params.start;
    const destinationPoint = route.params.destination;

    // TODO: Implement the navigation logic. API call to backend for directions

    return (
        <View style={styles.container}>
            <NavigationInfo startAddress={startPoint.civic_address} destinationAddress={destinationPoint.civic_address} 
            onBackPress={() => navigation.goBack()}
            />
            <MapView style={styles.map} />
            <NavigationModes />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    map: {
        flex: 1,
        marginBottom: 16,
    },
    navigationModes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default NavigationScreen;