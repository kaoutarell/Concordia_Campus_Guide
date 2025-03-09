import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
const NavigationMode = ({ mode, selectedMode, onModeChange, icon, name }) => {
  return (
    <TouchableOpacity
      style={[styles.navMode, selectedMode === mode && styles.activeMode]}
      onPress={() => onModeChange(mode)}
    >
      {React.cloneElement(icon, { color: selectedMode === mode ? "#fff" : "#800020" })}
      <Text style={[styles.text, { color: selectedMode === mode ? "#fff" : "black" }]}>{name}</Text>
    </TouchableOpacity>
  );
};

NavigationMode.propTypes = {
  mode: PropTypes.string.isRequired,
  selectedMode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
};

export default NavigationMode;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  navMode: {
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.14,
  },
  activeMode: {
    backgroundColor: "#800020",
  },

  text: {
    fontSize: 12,
  },
});
