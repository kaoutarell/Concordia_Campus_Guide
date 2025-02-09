// NavigationModes.js
import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 
import { modes } from '../../constants/TransportModes';
import styles from '../../styles/NavigationModesStyles'; // Import the styles

const NavigationModes = ({ 
  onModeChange, 
  onStartNavigation, 
  startAddress, 
  destinationAddress, 
}) => { 
  const [selectedMode, setSelectedMode] = useState('Walking');

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onModeChange(mode);
  };

  return (
    <View style={styles.container}>
      {/* Start and Destination Address Search Bar */}
      <View style={styles.searchContainer}>
        {/* Start Address TextInput with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Start Address" 
            value={startAddress} 
            onChangeText={(text) => onStartNavigation(text)} 
          />
        </View>

        {/* Destination Address TextInput with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Destination Address" 
            value={destinationAddress} 
            onChangeText={(text) => onStartNavigation(text)} 
          />
        </View>
      </View>

      {/* Navigation Modes at the top */}
      <View style={styles.navModesContainer}>
        {modes.map(({ mode, icon }) => (
          <TouchableOpacity 
            key={mode} 
            style={[styles.navMode, selectedMode === mode && styles.activeMode]} 
            onPress={() => handleModeChange(mode)} 
          >
            {/* Icon only, no text */}
            {React.cloneElement(icon, { color: selectedMode === mode ? '#fff' : '#800020' })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default NavigationModes;
