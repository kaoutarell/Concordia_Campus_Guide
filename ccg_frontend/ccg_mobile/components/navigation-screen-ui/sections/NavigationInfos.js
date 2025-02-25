import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import {formatDuration} from "../../../utils";

const { width } = Dimensions.get("window"); // Get device dimensions

const NavigationInfos = ({ totalDuration, totalDistance, onExit, onShowDirections }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.infoRow}>
                {/* Duration and Distance */}
                <View style={styles.infoItems}>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={20} color="#fff" />
                        <Text style={styles.infoText}>
                            {totalDuration ? formatDuration(totalDuration) : 'Duration not available'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="road" size={20} color="#fff" />
                        <Text style={styles.infoText}>
                            {totalDistance
                                ? (totalDistance / 1000).toFixed(2) + ' km'
                                : 'Distance not available'}
                        </Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.allButton} onPress={onShowDirections}>
                        <Text style={styles.allButtonText}>DIR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.exitButton} onPress={onExit}>
                        <Text style={styles.exitButtonText}>Exit</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default NavigationInfos;

const styles = StyleSheet.create({
    safeArea: {
        height: '16%', // Adjust as needed
        width: '100%',
        backgroundColor: '#800020',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    infoItems: {
        flex: 1,
        marginRight: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginLeft: 8,
        maxWidth: width - 200,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    exitButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#800020',
    },
    allButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    allButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#800020',
    },
});
