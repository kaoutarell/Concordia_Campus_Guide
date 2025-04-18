import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Marker } from "react-native-maps";
import markerImage from "../../../assets/marker-1.png";
import PropTypes from "prop-types";

const CustomMarker = ({ value, onPress, showMarker, isStartingPoint = false, destination = false }) => {
  return (
    <Marker
      coordinate={{
        latitude: value.location.latitude,
        longitude: value.location.longitude,
      }}
      title={value.building_code} //to allow end-to-end testing
      opacity={showMarker ? 1 : 0}
      onPress={e => {
        onPress();
      }}
    >
      <View testID="marker-container" style={styles.markerContainer}>
        <Image
          source={markerImage} // Your marker image
          style={[
            !destination ? styles.markerImage : styles.destinationMarker,
            isStartingPoint && { tintColor: "green" },
          ]}
        />
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value.building_code}</Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  destinationMarker: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  markerImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  valueContainer: {
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  valueText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

CustomMarker.propTypes = {
  value: PropTypes.shape({
    location: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    building_code: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  showMarker: PropTypes.bool.isRequired,
  destination: PropTypes.bool,
  isStartingPoint: PropTypes.bool,
};

export default CustomMarker;
