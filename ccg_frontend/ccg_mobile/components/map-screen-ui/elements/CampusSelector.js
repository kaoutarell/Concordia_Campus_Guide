import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

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

  const getCampusInitials = (campus) => {
    switch (campus) {
      case "SGW":
        return "SGW";
      case "LOY":
        return "LOY";
      default:
        return "??";
    }
  };

  const toggleCampus = () => {
    const newCampus = selectedCampus === "SGW" ? "LOY" : "SGW";
    onCampusSelect(newCampus);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.campusCircle}
        onPress={toggleCampus}
        testID="campus-button"
        accessibilityLabel={`Switch to ${selectedCampus === "SGW" ? "Loyola" : "Sir George Williams"} campus`}
      >
        <Text style={styles.campusInitials} testID="campus-name">
          {getCampusInitials(selectedCampus)}
        </Text>
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
    width: width * 0.7,
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
  campusCircle: {
    backgroundColor: "#8B1D3B",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  campusInitials: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CampusSelector;
