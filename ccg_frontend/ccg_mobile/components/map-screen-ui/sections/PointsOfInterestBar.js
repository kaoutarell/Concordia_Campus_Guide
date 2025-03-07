import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PointsOfInterestButton from "../elements/PointsOfInterestButton.js";
import { getPointOfInterests } from "../../../api/dataService.js";
import locationService from '../../../services/LocationService.js';

const PointsOfInterestBar = ({setAllLocations, campus, animateSearch}) => {
  const [selectedPOI, setSelectedPOI] = useState(null);


  const handleButtonPress = async (name,category) => {
    const newSelection = selectedPOI === category ? null : category;
    setSelectedPOI(newSelection);
    const loc = locationService.getCurrentLocation();

    try {
      const data = await getPointOfInterests(category, campus, loc.coords.longitude, loc.coords.latitude);
      setAllLocations(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
    animateSearch(name);
  };

  const POI_LIST = [
    { type: "restaurant", name: "Restaurants" },
    { type: "cafe", name: "Coffee" },
    { type: "library", name: "Library" },
    { type: "bank", name: "Bank" },
    { type: "clinic", name: "Clinic" },

  ];

  return (
    <>
        {POI_LIST.map((poi, index) => (
          <PointsOfInterestButton
            key={index}
            type={poi.type}
            name={poi.name}
            isSelected = {selectedPOI == poi.name}
            onPress={() => handleButtonPress(poi.name,poi.type)}
          />
        ))}
    </>
  );
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
