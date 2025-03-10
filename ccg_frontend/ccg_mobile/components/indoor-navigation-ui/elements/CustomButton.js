import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
const CustomButton = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} testID="custom-button">
        <Text style={styles.text} testID="custom-button-text">
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
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
