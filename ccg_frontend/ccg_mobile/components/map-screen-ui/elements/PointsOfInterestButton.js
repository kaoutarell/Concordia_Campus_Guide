import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PointsOfInterestButton = ({ emoji, name, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Button color
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30, //rounded
    marginRight: 10, // Space between buttons
    elevation: 5, // Shadow effect
  },
  emoji: {
    fontSize: 15,
    marginRight: 5, // Space between emoji and text
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B1D3B', // White text for contrast
  },
});

export default PointsOfInterestButton;