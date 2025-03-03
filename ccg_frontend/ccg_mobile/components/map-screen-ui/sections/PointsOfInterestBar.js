import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PointsOfInterestButton from "../elements/PointsOfInterestButton.js";

const PointsOfInterestBar = () => {
  const handleButtonPress = (category) => {
    console.log(`${category} button pressed`);
    // Add backend here
  };

 
  const POI_LIST = [
    { emoji: "🍽️", name: "Restaurants" },
    { emoji: "☕", name: "Cafés" },
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
