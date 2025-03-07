import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PointsOfInterestButton = ({ emoji, name, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.selectedButton]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={[styles.emoji, isSelected && styles.selectedText]}>{emoji}</Text>
      <Text style={[styles.text, isSelected && styles.selectedText]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Button color
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30, //rounded
    marginRight: 10, // Space between buttons
    elevation: 5, // Shadow effect
  },
  selectedButton: {
    backgroundColor: "#8B1D3B", // Burgundy background when selected
  },
  emoji: {
    fontSize: 15,
    marginRight: 5, // Space between emoji and text
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B1D3B", // White text for contrast
  },
  selectedText: {
    color: "#FFFFFF", // White text when selected
  },
});

export default PointsOfInterestButton;
