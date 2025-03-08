import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import IndoorMap from "./sections/IndoorMap";
import IndoorNavigationHeader from "./sections/IndoorNavigationHeader";
import { getBuildings } from "../../api/dataService";

const IndoorNavigationScreen = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Fetch buildings from the API -> dataservice
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const buildingsData = await getBuildings();
        const formattedBuildings = buildingsData.map((building) => ({
          label: building.name,
          value: building.id,
        }));
        setBuildings(formattedBuildings);
        if (formattedBuildings.length > 0) {
          setSelectedBuilding(formattedBuildings[0].value);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingChange = (value) => {
    setSelectedBuilding(value);
  };

  return (
    <View style={styles.container}>
      <IndoorNavigationHeader
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onBuildingChange={handleBuildingChange}
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
