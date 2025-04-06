import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import IndoorMap from "./sections/IndoorMap";
import IndoorNavigationHeader from "./sections/IndoorNavigationHeader";
import { getBuildings, getIndoorDirections } from "../../api/dataService";
import IndoorNavigationFooter from "./sections/IndoorNavigationFooter";
import FloorChangeButton from "./elements/FloorChangeButton";
import PropTypes from "prop-types";

const IndoorNavigationScreen = ({ route }) => {
  const params = route.params || {};
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(params.building || "");
  const [startLocation, setStartLocation] = useState(params.start || "");
  const [destination, setDestination] = useState(params.destination || "");
  const [path, setPath] = useState(null);
  const [floorIndex, setFloorIndex] = useState(0);
  const [floorIndexMax, setFloorIndexMax] = useState(1);
  const [showAccessibleRoute, setShowAccessibleRoute] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  //reset floorIndex when getting new directions
  useEffect(() => {
    setFloorIndex(0);
  }, [path]);

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
    console.log(value);
  };

  const handleStartLocationChange = location => {
    setStartLocation(location);
  };

  const handleDestinationChange = location => {
    setDestination(location);
  };

  const handleShowDirections = async (start, destination) => {
    if (!start || !destination) {
      return;
    }

    try {
      console.log("Fetching path between", start, "and", destination);

      // fetch the path data only when the button is pressed
      const pathData = await getIndoorDirections(showAccessibleRoute, start, destination);
      console.log(pathData);
      setPath(pathData); // set the path data
      if (path != "") {
        setFloorIndexMax(pathData["floor_sequence"].length - 1);
      }
      setIsSearching(true);
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  return (
    <View style={styles.container} testID="indoor-navigation-screen">
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
        index={floorIndex}
      />
      <FloorChangeButton
        currentFloor={floorIndex}
        maxFloor={floorIndexMax}
        setFloor={setFloorIndex}
        isSearching={isSearching}
      />
      <IndoorNavigationFooter
        onShowDirections={handleShowDirections} // Handle Get Direction button press
        startAddress={startLocation}
        destinationAddress={destination}
        showAccessibleRoute={showAccessibleRoute}
        setShowAccessibleRoute={setShowAccessibleRoute}
      />
    </View>
  );
};

IndoorNavigationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.string,
      start: PropTypes.string,
      destination: PropTypes.string,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default IndoorNavigationScreen;
