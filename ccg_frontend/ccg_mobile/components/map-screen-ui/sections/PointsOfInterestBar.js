import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PointsOfInterestButton from "../elements/PointsOfInterestButton.js";

const PointsOfInterestBar = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  const handleButtonPress = category => {
    const newSelection = selectedPOI === category ? null : category;
    setSelectedPOI(newSelection);
    console.log(`Selected POI: ${newSelection}`); //check which POI was selected

    // for whoever that will work on the backend
    // Add backend here
    // Here, notify the backend with the selected POI
    // You can call a backend API based on the selected POI
    // For example, if the selected category is "Restaurants", make an API call to get restaurant data
    // implement an API call here, where category = selectedPOI
    // Example: fetchPOIData(selectedPOI); // Call backend to fetch data based on POI
  };

  const POI_LIST = [
    { emoji: "🍽️", name: "Restaurants" },
    { emoji: "☕", name: "Coffee" },
    { emoji: "🍻", name: "Bars" },
    { emoji: "📕", name: "Library" },
    { emoji: "🏦", name: "Bank" },
  ];

  return (
    <View style={styles.poiContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {POI_LIST.map((poi, index) => (
          <PointsOfInterestButton
            key={index}
            emoji={poi.emoji}
            name={poi.name}
            isSelected={selectedPOI == poi.name}
            onPress={() => handleButtonPress(poi.name)}
          />
        ))}
      </ScrollView>
    </View>
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
