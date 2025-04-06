import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const FloorChangeButton = ({ currentFloor, maxFloor, setFloor, isSearching }) => {
  const increment = () => {
    if (currentFloor < maxFloor) {
      setFloor(currentFloor + 1);
    }
  };

  const decrement = () => {
    if (currentFloor > 0) {
      setFloor(currentFloor - 1);
    }
  };
  return (
    <View style={styles.view}>
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.button} onPress={decrement} testID="prev-button">
          <Text style={styles.text}>{"< Prev Step"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={increment} testID="next-button">
          <Text style={styles.text}>{"Next Step >"}</Text>
        </TouchableOpacity>
      </View>
      {isSearching == true && (
        <Text style={styles.stepText}>
          {"["}Step {currentFloor + 1}/{maxFloor + 1}
          {"]"}
        </Text>
      )}
      {isSearching == false && (
        <Text style={styles.stepText}>
          {"["}Generate Directions to a Room{"]"}
        </Text>
      )}
    </View>
  );
};

FloorChangeButton.propTypes = {
  currentFloor: PropTypes.number,
  maxFloor: PropTypes.number,
  setFloor: PropTypes.func,
  isSearching: PropTypes.bool,
};

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 12,
    backgroundColor: "#800020", // Burgundy
    borderRadius: 30, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    width: 150, // Fixed width for consistency
    height: 50, // Fixed height for consistency
    elevation: 5, // Shadow effect
    marginLeft: 10,
    marginRight: 10,
  },
  stepText: {
    padding: 12,
    //backgroundColor: "#800020", // Burgundy
    borderRadius: 30, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    width: 500, // Fixed width for consistency
    height: 100, // Fixed height for consistency
    //elevation: 5, // Shadow effect
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default FloorChangeButton;
