import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import NavigationHeader from "./sections/NavigationHeader";
import NavigationMap from "./sections/NavigationMap";
import NavigationInfo from "./sections/NavigationInfo";
import BusNavigationInfo from "./sections/BusNavigationInfo";
import { getDirections, getDirectionProfiles, getShuttleStops } from "../../api/dataService";
import busLocationService from "../../services/BusLocationService";

const NavigationScreen = ({ navigation, route }) => {
  const { start = {}, destination = {} } = route.params || {};

  const [directionProfiles, setDirectionProfiles] = useState({});
  const [shuttleStops, setShuttleStops] = useState([]);
  const [direction, setDirection] = useState(null);
  const [shuttleLocations, setShuttleLocations] = useState([]);
  const [selectedMode, setSelectedMode] = useState("foot-walking");

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const fetchDirections = async () => {
    try {
      const { profiles } = await getDirectionProfiles();
      const directions = {};

      // Fetch "foot-walking" direction synchronously if available.
      if (profiles.includes("foot-walking")) {
        directions["foot-walking"] = await getDirections(
          "foot-walking",
          [start.location.longitude, start.location.latitude],
          [destination.location.longitude, destination.location.latitude]
        );
        setDirection(directions["foot-walking"]);
      }

      // Fetch other profiles in parallel.
      const fetchPromises = profiles
        .filter((profile) => profile !== "foot-walking")
        .map(async (profile) => {
          directions[profile] = await getDirections(
            profile,
            [start.location.longitude, start.location.latitude],
            [destination.location.longitude, destination.location.latitude]
          );
        });

      await Promise.all(fetchPromises);
      setDirectionProfiles(directions);
    } catch (error) {
      console.error("Error fetching direction data:", error);
      setDirection(null);
    }
  };

  // Fetch shuttle stops once when the component mounts.
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const shuttle = await getShuttleStops();
        setShuttleStops(shuttle?.stops || []);
      } catch (error) {
        console.error("Error fetching shuttle stops:", error);
      }
    };

    fetchStops();
  }, []);

  // Fetch directions once start, destination, and shuttle stops are available.
  useEffect(() => {
    if (start.location && destination.location && shuttleStops.length > 0) {
      fetchDirections();
    }
  }, [start, destination, shuttleStops]);

  // Handle shuttle tracking and update current direction based on selected mode.
  useEffect(() => {
    let intervalId;
    if (selectedMode === "concordia-shuttle") {
      busLocationService.startTracking(500);
      intervalId = setInterval(() => {
        setShuttleLocations(busLocationService.getBusLocations());
      }, 500);
    }
    setDirection(directionProfiles[selectedMode] || null);
    return () => {
      if (selectedMode === "concordia-shuttle") {
        busLocationService.stopTracking();
        clearInterval(intervalId);
      }
    };
  }, [selectedMode, directionProfiles]);

  return (
    <View style={styles.container}>
      <NavigationHeader
        startAddress={
          selectedMode === "concordia-shuttle"
            ? "SGW Shuttle Stop"
            : start.civic_address
        }
        destinationAddress={
          selectedMode === "concordia-shuttle"
            ? "LOY Shuttle Stop"
            : destination.civic_address
        }
        onSelectedMode={handleModeSelect}
        onBackPress={() => navigation.goBack()}
        selectedMode={selectedMode}
      />

      <View style={styles.mapContainer}>
        {direction && (
          <NavigationMap
            start={start}
            destination={destination}
            pathCoordinates={direction.steps}
            bbox={direction.bbox}
            displayShuttle={selectedMode === "concordia-shuttle"}
            shuttleLocations={shuttleLocations}
            shuttleStops={shuttleStops}
          />
        )}
      </View>

      {direction &&
        (selectedMode === "concordia-shuttle" ? (
          <BusNavigationInfo
            totalDistance={direction.total_distance}
            totalDuration={direction.total_duration}
          />
        ) : (
          <NavigationInfo
            totalDistance={direction.total_distance}
            totalDuration={direction.total_duration}
            onStartNavigation={() => {}}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mapContainer: {
    height: "60%",
    width: "100%",
  },
});

export default NavigationScreen;