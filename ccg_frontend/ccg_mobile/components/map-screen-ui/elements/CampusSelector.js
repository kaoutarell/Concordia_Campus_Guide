import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";

const CampusSelector = ({ selectedCampus = "SGW", onCampusSelect, compact = false }) => {
  const getCampusName = (campus) => {
    switch (campus) {
      case "SGW":
        return "Sir George Williams";
      case "LOY":
        return "Loyola";
      default:
        return "Error: Unknown Campus";
    }
  };

  const toggleCampus = () => {
    const newCampus = selectedCampus === "SGW" ? "LOY" : "SGW";
    onCampusSelect(newCampus);
  };

  if (compact) {
    return (
      <TouchableOpacity
      style={styles.campusToggle}
      onPress={toggleCampus}
      testID="campus-button"
      accessibilityLabel={`Switch to ${selectedCampus === "SGW" ? "Loyola" : "Sir George Williams"} campus`}
    >
      {/* SGW Side */}
      <View style={[styles.toggleOption, selectedCampus === "SGW" && styles.activeCampus]}>
        <Text style={[styles.campusText, selectedCampus === "SGW" && styles.activeText]}>SGW</Text>
      </View>

      {/* LOY Side */}
      <View style={[styles.toggleOption, selectedCampus === "LOY" && styles.activeCampus]}>
        <Text style={[styles.campusText, selectedCampus === "LOY" && styles.activeText]}>LOY</Text>
      </View>
    </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.campusButton}
      onPress={toggleCampus}
      testID="campus-button"
    >
      <Text style={styles.campusText} testID="campus-name">
        {getCampusName(selectedCampus)}
      </Text>
      <FontAwesome
        name="exchange"
        size={14}
        color="white"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

// prop validation
CampusSelector.propTypes = {
  selectedCampus: PropTypes.string.isRequired,
  onCampusSelect: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

const styles = StyleSheet.create({
  campusToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
    height: 55,
    padding: 3,
    width: 100,
    alignSelf: "center",
  },
  toggleOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
  },
  activeCampus: {
    backgroundColor: "#8B1D3B",
  },
  campusText: {
    color: "#8B1D3B",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeText: {
    color: "white",
  },
});

export default CampusSelector;
