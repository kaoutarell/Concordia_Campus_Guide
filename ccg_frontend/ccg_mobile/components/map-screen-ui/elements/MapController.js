import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MapController = ({ onCurrentLocation, onZoomIn, onZoomOut }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onCurrentLocation}>
                <Ionicons name="locate" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.zoomContainer}>
                <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
                    <Ionicons name="remove" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        alignItems: 'center',
    },
    zoomContainer: {
        backgroundColor: 'white',
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 10, // Spacing between zoom and locate button
    },
    zoomButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd', // Light separator
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 10,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MapController;
