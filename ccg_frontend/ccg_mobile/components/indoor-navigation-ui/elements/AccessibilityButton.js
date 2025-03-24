import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import wheelchair from "../../../assets/wheelchair.png";

const AccessibleRouteButton = ({ showAccessibleRoute, setShowAccessibleRoute, onShowDirections }) => {
  const onPress = () => {
    setShowAccessibleRoute(!showAccessibleRoute);
    onShowDirections();
  };

  return (
    <View>
      {!showAccessibleRoute && (
        <TouchableOpacity style={styles.buttonFalse} onPress={onPress}>
          <Image source={wheelchair} style={{ width: "150%", height: "150%", tintColor: "white" }} />
        </TouchableOpacity>
      )}
      {showAccessibleRoute && (
        <TouchableOpacity style={styles.buttonTrue} onPress={onPress}>
          <Image source={wheelchair} style={{ width: "150%", height: "150%", tintColor: "black" }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

AccessibleRouteButton.propTypes = {
  showAccessibleRoute: PropTypes.bool,
  setShowAccessibleRoute: PropTypes.func,
  onShowDirections: PropTypes.func,
};

const styles = StyleSheet.create({
  buttonFalse: {
    padding: 12,
    backgroundColor: "#800020", // Burgundy
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 90, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    width: 50, // Fixed width for consistency
    height: 50, // Fixed height for consistency
    elevation: 5, // Shadow effect
    marginLeft: 10,
    marginRight: 10,
  },
  buttonTrue: {
    padding: 12,
    backgroundColor: "white", // Burgundy
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 90, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    width: 50, // Fixed width for consistency
    height: 50, // Fixed height for consistency
    elevation: 5, // Shadow effect
    marginLeft: 10,
    marginRight: 10,
  },
});
export default AccessibleRouteButton;
