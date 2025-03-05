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
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#800020", // Burgundy
    borderRadius: "50%",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});

export default CustomButton;
