import { React, Image, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import { useEffect } from "react";

const controllerIcons = {
  locate: require("../../../assets/locate.png"),
  zoomIn: require("../../../assets/zoom_in.png"),
  zoomOut: require("../../../assets/zoom_out.png"),
  resetStartPoint: require("../../../assets/reset_start_point.png"),
};

const MapController = ({ onCurrentLocation, onZoomIn, onZoomOut, startLocation = null, setStartLocation = null }) => {
  const onResetStartPoint = () => {
    setStartLocation(null);
  };

  return (
    <View style={styles.container}>
      {startLocation?.id ? (
        <TouchableOpacity style={styles.resetStartPoint} onPress={onResetStartPoint} testID="reset-start-point-button">
          <Image source={controllerIcons.resetStartPoint} style={styles.icon} />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={onCurrentLocation} testID="locate-button">
        <Image source={controllerIcons.locate} style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn} testID="zoom-in-button">
          <Image source={controllerIcons.zoomIn} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut} testID="zoom-out-button">
          <Image source={controllerIcons.zoomOut} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

MapController.propsTypes = {
  onCurrentLocation: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  startLocation: PropTypes.object,
  setStartLocation: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    alignItems: "center",
  },
  zoomContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 10, // Spacing between zoom and locate button
  },
  zoomButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Light separator
  },
  button: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resetStartPoint: {
    backgroundColor: "#FF4C4C",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, // Spacing between buttons
  },
  resetStartPointText: {
    fontSize: 12,
    marginTop: 5,
    color: "white",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default MapController;
