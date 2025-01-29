import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NavigationToggle = ({ isIndoor, setIsIndoor }) => {
    return (
        <View style={styles.navContainer}>
            <TouchableOpacity
                style={[styles.navButton, !isIndoor && styles.activeNav]}
                onPress={() => setIsIndoor(false)}
            >
                <Text style={styles.navText}>Outdoor</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.navButton, isIndoor && styles.activeNav]}
                onPress={() => setIsIndoor(true)}
            >
                <Text style={styles.navText}>Indoor</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 30,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    navButton: {
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    activeNav: {
        backgroundColor: 'maroon',
    },
    navText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default NavigationToggle;
