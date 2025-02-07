import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationInfo = ({ startAddress, destinationAddress, totalDuration, totalDistance, onBackPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.label}>Start Address:</Text>
            <Text style={styles.value}>{startAddress}</Text>
            <Text style={styles.label}>Destination Address:</Text>
            <Text style={styles.value}>{destinationAddress}</Text>
            <Text style={styles.label}>Total Duration:</Text>
            <Text style={styles.value}>{totalDuration}</Text>
            <Text style={styles.label}>Total Distance:</Text>
            <Text style={styles.value}>{totalDistance}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        marginBottom: 10,
    },
});

export default NavigationInfo;