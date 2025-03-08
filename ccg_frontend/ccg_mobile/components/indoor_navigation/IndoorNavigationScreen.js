import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import IndoorMap from "./sections/IndoorMap";
import IndoorNavigationHeader from "./sections/IndoorNavigationHeader";

const IndoorNavigationScreen = () => {
  // Define buildings and selectedBuilding state // static for now
  const [buildings, setBuildings] = useState([
    { label: "Hall Building", value: "hall" },
    { label: "Library", value: "library" },
    { label: "Gym", value: "gym" },
  ]);

  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Set default building if not selected yet
  useEffect(() => {
    if (buildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(buildings[0].value); // Set default building when buildings are available
    }
  }, [buildings, selectedBuilding]);

  const handleBuildingChange = (value) => {
    setSelectedBuilding(value); // Update the selected building state / for dropdown
  };

  const handleBackPress = () => {
    console.log("Back button pressed");
  };

  return (
    <View style={styles.container}>
      <IndoorNavigationHeader
        buildings={buildings} // static buildings array here for now --> replaced by api
        selectedBuilding={selectedBuilding}
        onBuildingChange={handleBuildingChange}
        onBackPress={handleBackPress}
      />
      <IndoorMap />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default IndoorNavigationScreen;
