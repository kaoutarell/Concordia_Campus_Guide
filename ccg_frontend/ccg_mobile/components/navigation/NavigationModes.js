import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const NavigationModes = ({ onModeChange, onStartNavigation }) => {
    const [selectedMode, setSelectedMode] = useState('Walking');

    const modes = ['Walking', 'Bicycle', 'Driving', 'Public Transport', 'Concordia Shuttle'];

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
        onModeChange(mode);
    };

    return (
        <View style={styles.container}>
            <View style={styles.bottomSection}>
                {modes.map((mode) => (
                    <Button
                        key={mode}
                        title={mode}
                        onPress={() => handleModeChange(mode)}
                        color={selectedMode === mode ? 'blue' : 'gray'}
                    />
                ))}
                <Button title="Start Navigation" onPress={onStartNavigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
});

export default NavigationModes;