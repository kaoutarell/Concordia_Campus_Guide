import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import IndoorMap from "./sections/IndoorMap";
import IndoorNavigationHeader from "./sections/IndoorNavigationHeader";
import { getBuildings, getIndoorDirections } from "../../api/dataService";
import IndoorNavigationFooter from "./sections/IndoorNavigationFooter";

const IndoorNavigationScreen = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [path, setPath] = useState("");

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

        // default building to "Henry F. Hall Building"
        const defaultBuilding = formattedBuildings.find(building => building.label === "Henry F. Hall Building");
        if (defaultBuilding) {
          setSelectedBuilding(defaultBuilding.value);
        } else if (formattedBuildings.length > 0) {
          // Fallback to the first building in the list
          setSelectedBuilding(formattedBuildings[0].value);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
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

  const handleShowDirections = async (start, destination) => {
    if (!start || !destination) {
      console.error("Start location and destination are required.");
      return;
    }

    try {
      console.log("Fetching path between", start, "and", destination);

      // fetch the path data only when the button is pressed
      const pathData = await getIndoorDirections("foot-walking", start, destination);
      setPath(pathData); // set the path data
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  return (
    <View style={styles.container}>
      <IndoorNavigationHeader
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onBuildingChange={handleBuildingChange}
        startLocation={startLocation}
        destination={destination}
        onStartLocationChange={handleStartLocationChange}
        onDestinationChange={handleDestinationChange}
      />
      <IndoorMap
        startLocation={startLocation}
        destination={destination}
        path={path} // path data to IndoorMap
      />
      <IndoorNavigationFooter
        onShowDirections={handleShowDirections} // Handle Get Direction button press
        startAddress={startLocation}
        destinationAddress={destination}
      />
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
