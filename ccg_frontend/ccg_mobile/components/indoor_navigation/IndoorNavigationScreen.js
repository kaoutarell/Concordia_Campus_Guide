import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import IndoorMap from "./sections/IndoorMap";
import IndoorNavigationHeader from "./sections/IndoorNavigationHeader";
import { getBuildings } from "../../api/dataService";

// Debounce helper function to delay the API request
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Clean up the timeout on re-render
    };
  }, [value, delay]);

  return debouncedValue;
};

const IndoorNavigationScreen = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");

  // Fetch buildings from the API
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const buildingsData = await getBuildings();
        const formattedBuildings = buildingsData.map(building => ({
          label: building.name,
          value: building.id,
        }));
        setBuildings(formattedBuildings);

        // Set default building to "Henry F. Hall Building"
        const defaultBuilding = formattedBuildings.find(building => building.label === "Henry F. Hall Building");
        if (defaultBuilding) {
          setSelectedBuilding(defaultBuilding.value);
        } else if (formattedBuildings.length > 0) {
          // Fallback to the first building in the list
          setSelectedBuilding(formattedBuildings[0].value);
        }
      } catch (error) {
        //console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingChange = value => {
    setSelectedBuilding(value);
  };

  const handleStartLocationChange = location => {
    setStartLocation(location);
  };

  const handleDestinationChange = location => {
    setDestination(location);
  };

  return (
    <View style={styles.container}>
      <IndoorNavigationHeader
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onBuildingChange={handleBuildingChange}
        startLocation={startLocation}
        destination={destination}
        onModifyAddress={handleStartLocationChange}
        onDestinationChange={handleDestinationChange}
      />
      <IndoorMap startLocation={startLocation} destination={destination} />
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
