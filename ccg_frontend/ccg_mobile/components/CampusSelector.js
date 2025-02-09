import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

const CampusSelector = ({ selectedCampus = "SGW", onCampusSelect }) => {
  const getCampusName = (campus) => {
    switch (campus) {
      case "SGW":
        return "Sir George Williams";
      case "LOY":
        return "Loyola";
      default:
        return "Error: Unknown Campus"; // in case the value is unexpected
    }
  };

  const toggleCampus = () => {
    const newCampus = selectedCampus === "SGW" ? "LOY" : "SGW";
    onCampusSelect(newCampus);
  };

  return (
    <TouchableOpacity
      style={styles.campusButton}
      onPress={toggleCampus}
      testID="campus-button"
    >
      <Text style={styles.campusText}>{getCampusName(selectedCampus)}</Text>
      <FontAwesome
        name="chevron-down"
        size={14}
        color="white"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

// prop validation
CampusSelector.propTypes = {
  selectedCampus: PropTypes.string.isRequired, // Must be a string
  onCampusSelect: PropTypes.func.isRequired, // Must be a function
};

const styles = StyleSheet.create({
  campusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#8B1D3B",
    color: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: width * 0.8, // Responsive width
    alignSelf: "center",
  },
  campusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 10,
  },
});

export default CampusSelector;
