import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getBuildings, getPointOfInterests } from "../../api/dataService";

import MapViewComponent from "./sections/MapViewComponent";
import NavigationToggle from "./sections/NavigationToggle";
import { initialRegionSGW, initialRegionLoyola, maxBoundsSGW, maxBoundsLoyola } from "../../constants/initialRegions";

import PointsOfInterestBar from "./sections/PointsOfInterestBar";
import HeaderBar from "./sections/HeaderBar";

const MapScreen = () => {
  const navigation = useNavigation(); // Get navigation object
  const [allLocations, setAllLocations] = useState([]); //gets the buildings in both campus
  const [pointsOfInterest, setPointsOfInterest] = useState([]); //gets the buildings in both campus
  const [selectedCampus, setSelectedCampus] = useState("SGW");
  const [isIndoor, setIsIndoor] = useState(false);
  const [selectedPointOfInterest, setSelectedPointOfInterest] = useState(null);

  const [targetLocation, setTargetLocation] = useState({});

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
        await fetchPointsOfInterests();
        console.log("Data fetched successfully.");
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    if (selectedCampus) {
      setData();
    }
  }, []);

  // Navigate to IndoorScreen when isIndoor is true
  useEffect(() => {
    if (isIndoor) {
      navigation.navigate("Indoor");
    }
  }, [isIndoor, navigation]);

  // Navigate to IndoorScreen when isIndoor is true
  useEffect(() => {
    if (isIndoor) {
      navigation.navigate("Indoor");
    }
  }, [isIndoor, navigation]);

  const onCampusSelect = campus => {
    setSelectedCampus(prevCampus => {
      if (prevCampus !== campus) {
        return campus;
      }
      return prevCampus;
    });
    setTargetLocation({});
    setSelectedPointOfInterest([]);
  };

  const fetchAllLocations = async () => {
    try {
      const data = await getBuildings();
      setAllLocations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPointsOfInterests = async () => {
    try {
      const data = await getPointOfInterests();
      setPointsOfInterest(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar
        setTargetLocation={setTargetLocation}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        onCampusSelect={onCampusSelect}
        locations={allLocations}
        pointsOfInterest={pointsOfInterest}
      />
      {/*Points of Interest Bar */}
      <PointsOfInterestBar setSelectedPointOfInterest={setSelectedPointOfInterest} campus={selectedCampus} />

      {/* Map */}
      <MapViewComponent
        locations={allLocations}
        pointsOfInterest={pointsOfInterest}
        target={targetLocation}
        region={getRegion()}
        maxBounds={getMaxBounds()}
        selectedPointOfInterest={selectedPointOfInterest}
      />

      <NavigationToggle isIndoor={isIndoor} setIsIndoor={setIsIndoor} />
    </SafeAreaView >
  );
};

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Safe area for Android
  },

  menuButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },

  menuText: {
    fontSize: isSmallDevice ? 24 : 30,
  },

  title: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.05,
  },

  campusSelector: {
    backgroundColor: "#8B1D3B",
    paddingVertical: isSmallDevice ? 6 : 10,
    paddingHorizontal: isSmallDevice ? 14 : 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },

  campusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 12 : 14,
  },

  map: {
    flex: 1,
    width: "100%",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: isSmallDevice ? 8 : 16,
  },

  switchButton: {
    paddingVertical: isSmallDevice ? 6 : 10,
    paddingHorizontal: isSmallDevice ? 10 : 14,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
});


export default MapScreen;
