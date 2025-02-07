import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const NavigationModes = ({ onModeChange, onStartNavigation }) => {
    const [selectedMode, setSelectedMode] = useState('Walking');

    const modes = ['Walking', 'Bicycle', 'Driving', 'Public Transport', 'Concordia Shuttle'];
    const modesIcons = {
        Walking: 'w',
        Bicycle: 'b',
        Driving: 'c',
        'Public Transport': 'pt',
        'Concordia Shuttle': 'cs',
    };
    const handleModeChange = (mode) => {
        setSelectedMode(mode);
        onModeChange(mode);
    };

    return (
        <View style={styles.navContainer}>
            {modes.map((mode) => (
                <View
                    key={mode}
                    style={[
                        styles.navButton,
                        selectedMode === mode && styles.activeNav,
                    ]}
                >
                    <Text
                        style={[
                            styles.navText,
                            selectedMode === mode && styles.activeText,
                        ]}
                        onPress={() => handleModeChange(mode)}
                    >
                        {modesIcons[mode]}
                    </Text>
                </View>
            ))}
            <Button title="Start Navigation" onPress={onStartNavigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        position: "absolute",
        bottom: 30,
        left: width * 0.1,
        right: width * 0.1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5, // Shadow for Android
    },
    navButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        marginHorizontal: 5,
    },
    activeNav: {
        backgroundColor: "#8B1D3B",
    },
    navText: {
        fontSize: 16,
        color: "#8B1D3B",
        fontWeight: "bold",
    },
    activeText: {
        color: "white",
    },
});

export default NavigationModes;