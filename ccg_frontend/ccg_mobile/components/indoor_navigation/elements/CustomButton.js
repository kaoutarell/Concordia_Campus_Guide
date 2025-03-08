import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const CustomButton = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10, // Add margin at the bottom for spacing
  },
  button: {
    padding: 12,
    backgroundColor: "#800020", // Burgundy
    borderRadius: 30, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    width: 50, // Fixed width for consistency
    height: 50, // Fixed height for consistency
    elevation: 5, // Shadow effect
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default CustomButton;
