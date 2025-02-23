import React, { useEffect, useState } from 'react';
import {getBuildings } from '../../api/dataService';

import MapViewComponent from "./sections/MapViewComponent";
import NavigationToggle from "./sections/NavigationToggle";
import {
  initialRegionSGW,
  initialRegionLoyola,
  maxBoundsSGW,
  maxBoundsLoyola,
} from "../../constants/initialRegions";

import { useNavigation } from "@react-navigation/native";


import { View, StyleSheet } from "react-native";

import HeaderBar from './sections/HeaderBar';

const MapScreen = () => {
  const navigation = useNavigation();

  
  const [allLocations, setAllLocations] = useState([]); //gets the buildings in both campus
  const [selectedCampus, setSelectedCampus] = useState("SGW");
  const [isIndoor, setIsIndoor] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);

  const getRegion = () => {
    return selectedCampus === "SGW" ? initialRegionSGW : initialRegionLoyola;
  };

  const getMaxBounds = () => {
    return selectedCampus === "SGW" ? maxBoundsSGW : maxBoundsLoyola;
  };

  useEffect(() => {

    const setData = async () => {
      try {

        
        await fetchAllLocations();
        console.log("Data fetched successfully.");
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    if (selectedCampus) {
      setData();
    }
  }, []);

  const onCampusSelect = (campus) => {

    setSelectedCampus((prevCampus) => {
      if (prevCampus !== campus) {
        return campus;
      }
      return prevCampus;
    });
  };



  const fetchAllLocations = async () => { //gets the buildings of both campus for the purpose of getting directions from one campus to the other
    try {
      const data = await getBuildings();
      setAllLocations(data);
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  const handleViewNavigation = (start, destination) => {
    navigation.navigate("Navigation", {
      start,
      destination,
    });
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        selectedCampus={selectedCampus}
        onCampusSelect={onCampusSelect}
        locations={allLocations}
        setStartLocation={setStartLocation}
        setDestinationLocation={setDestinationLocation}
        handleViewNavigation={handleViewNavigation}
      />

      {/* Map */}
      <MapViewComponent 
        destination={destinationLocation} 
        locations={allLocations} 
        region={getRegion()} 
        maxBounds={getMaxBounds()}
      />

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
