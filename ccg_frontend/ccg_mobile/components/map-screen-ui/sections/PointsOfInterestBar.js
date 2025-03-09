import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PointsOfInterestButton from "../elements/PointsOfInterestButton.js";
import { getPointOfInterests } from "../../../api/dataService.js";
import locationService from "../../../services/LocationService.js";
import PropTypes from "prop-types";

const PointsOfInterestBar = ({ campus, setSelectedPointOfInterest }) => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  useEffect(() => {
    setSelectedPOI(null);
  }, [campus]);

  const handleButtonPress = async category => {
    const newSelection = selectedPOI === category ? null : category;
    setSelectedPOI(newSelection);
    const loc = locationService.getCurrentLocation();

    try {
      if (selectedPOI !== category) {
        const data = await getPointOfInterests(category, campus, loc.coords.longitude, loc.coords.latitude);
        setSelectedPointOfInterest(data.slice(0, 10));
      } else {
        setSelectedPointOfInterest([]);
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  const POI_LIST = [
    { type: "restaurant", name: "Restaurants" },
    { type: "cafe", name: "Coffee" },
    { type: "fast_food", name: "Fast Food" },
    { type: "library", name: "Library" },
    { type: "atm", name: "ATM" },
    { type: "clinic", name: "Clinic" },
  ];

  return (
    <View style={styles.poiContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {POI_LIST.map((poi, index) => (
          <PointsOfInterestButton
            key={`poi-${index}`}
            type={poi.type}
            name={poi.name}
            isSelected={selectedPOI == poi.type}
            onPress={() => handleButtonPress(poi.type)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

PointsOfInterestBar.propTypes = {
  campus: PropTypes.string.isRequired,
  setSelectedPointOfInterest: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  poiContainer: {
    position: "absolute",
    top: 110, // Positioned under the HeaderBar
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-around", // Space out buttons
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 10,
  },
  poiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  poiText: {
    marginLeft: 8,
    color: "#8B1D3B",
    fontWeight: "bold",
  },
});

export default PointsOfInterestBar;
