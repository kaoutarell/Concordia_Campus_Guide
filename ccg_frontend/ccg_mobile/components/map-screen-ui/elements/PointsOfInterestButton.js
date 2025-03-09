import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { getCategoryIcon } from "../../../utils/categoryIcons.js";

const PointsOfInterestButton = ({ type, name, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.selectedButton]}
      activeOpacity={0.7}
      onPress={onPress}
      testID="points-of-interest-button"
    >
      <Image source={getCategoryIcon(type)} style={styles.icon} />
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
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000", // White text for contrast
  },
  selectedText: {
    color: "#FFFFFF", // White text when selected
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
});

export default PointsOfInterestButton;
