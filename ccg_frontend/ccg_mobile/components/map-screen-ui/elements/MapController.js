import { React, Image } from "react-native";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const controllerIcons = {
  locate: require("../../../assets/locate.png"),
  zoomIn: require("../../../assets/zoom_in.png"),
  zoomOut: require("../../../assets/zoom_out.png"),
};

const MapController = ({ onCurrentLocation, onZoomIn, onZoomOut }) => {
  return (
    <View style={styles.container}>
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
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default MapController;
