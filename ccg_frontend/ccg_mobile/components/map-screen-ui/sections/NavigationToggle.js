import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
const { width } = Dimensions.get("window");

const NavigationToggle = ({ isIndoor, setIsIndoor }) => {
  return (
    <View style={styles.navContainer}>
      {/* Outdoor Button */}
      <TouchableOpacity style={[styles.navButton, !isIndoor && styles.activeNav]} onPress={() => setIsIndoor(false)}>
        <Text style={[styles.navText, !isIndoor && styles.activeText]}>Outdoor</Text>
      </TouchableOpacity>

      {/* Indoor Button */}
      <TouchableOpacity style={[styles.navButton, isIndoor && styles.activeNav]} onPress={() => setIsIndoor(true)}>
        <Text style={[styles.navText, isIndoor && styles.activeText]}>Indoor</Text>
      </TouchableOpacity>
    </View>
  );
};

NavigationToggle.propTypes = {
  isIndoor: PropTypes.bool.isRequired,
  setIsIndoor: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    bottom: 30,
    left: width * 0.1,
    right: width * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  activeNav: {
    backgroundColor: "#8B1D3B",
  },
  navText: {
    fontSize: 16,
    color: "#8B1D3B",
    fontWeight: "bold",
  },
  activeText: {
    color: "white",
  },
});

export default NavigationToggle;
