import React, { useEffect, useState } from 'react';
import { getBuildingByCampus } from '../api/dataService';

import MapViewComponent from "../components/MapViewComponent";
import NavigationToggle from "../components/NavigationToggle";
import {
  initialRegionSGW,
  initialRegionLoyola,
} from "../constants/initialRegions";

import { useNavigation } from "@react-navigation/native";


import { View, StyleSheet } from "react-native";

import HeaderBar from '../components/HeaderBar';

const MapScreen = () => {
  const navigation = useNavigation();

  const [locations, setLocations] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("SGW");
  const [isIndoor, setIsIndoor] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startPoint, setStartLocation] = useState(null);

  const getRegion = () => {
    return selectedCampus === "SGW" ? initialRegionSGW : initialRegionLoyola;
  };

  useEffect(() => {
    if (selectedCampus) {
      fetchLocations();
    }
  }, [selectedCampus]);

  const onCampusSelect = (campus) => {
    setSelectedCampus(campus);
    //await fetchLocations();
  };

  const fetchLocations = async () => {
    try {

      const data = await getBuildingByCampus(selectedCampus);
      setLocations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleViewNavigation = (start,destination) => {
    console.log("Start: ", start.civic_address);
    console.log("Destination: ", destination.civic_address);
          navigation.navigate("Navigation", {
              start,
              destination,
          });
  }

  //TODO: start and destination objects are here
  //
  return ( 
    <View style={styles.container}>
        <HeaderBar
          selectedCampus={selectedCampus}
          onCampusSelect={onCampusSelect}
          locations={locations}
          setStartLocation={setStartLocation}
          setDestinationLocation={setDestinationLocation}
          handleViewNavigation={handleViewNavigation}
        />
      {/* Map */}
      <MapViewComponent destination={destinationLocation} locations={locations} region={getRegion()} />

      <NavigationToggle isIndoor={isIndoor} setIsIndoor={setIsIndoor} />

    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  menuButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  menuText: { fontSize: 30 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  campusSelector: {
    backgroundColor: "#8B1D3B",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  campusText: { color: "white", fontWeight: "bold" },
  map: { flex: 1 },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  switchButton: { padding: 10, backgroundColor: "#eee", borderRadius: 10 },
});

export default MapScreen;
