import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import DurationAndDistanceInfo from "../elements/DurationAndDistanceInfo";
import PropTypes from "prop-types";

const NavigationInfos = ({ totalDuration, totalDistance, onExit, onShowDirections }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.infoRow}>
        <DurationAndDistanceInfo duration={totalDuration} distance={totalDistance} />
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

NavigationInfos.propTypes = {
  totalDuration: PropTypes.number,
  totalDistance: PropTypes.number,
  onExit: PropTypes.func.isRequired,
  onShowDirections: PropTypes.func.isRequired,
};

export default NavigationInfos;

const styles = StyleSheet.create({
    safeArea: {
        height: '16%', // Adjust as needed
        width: '100%',
        backgroundColor: '#800020',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,  
        borderTopRightRadius: 30, 
        borderBottomLeftRadius: 0,  
        borderBottomRightRadius: 0, 
    },
    infoRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
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
