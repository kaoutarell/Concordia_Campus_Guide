import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import PropTypes from "prop-types";
import NavigationHeader from "./sections/NavigationHeader";
import NavigationMap from "./sections/NavigationMap";
import NavigationInfo from "./sections/NavigationInfo";
import BusNavigationInfo from "./sections/BusNavigationInfo";
import { getDirections, getDirectionProfiles, getShuttleStops } from "../../api/dataService";
import busLocationService from "../../services/BusLocationService";

let cachedShuttleStops = null;

const NavigationScreen = ({ navigation, route }) => {
  const { start = {}, destination = {} } = route.params || {};

  const [directionProfiles, setDirectionProfiles] = useState({});
  const [shuttleStops, setShuttleStops] = useState([]);
  const [direction, setDirection] = useState(null);
  const [shuttleLocations, setShuttleLocations] = useState([]);
  const [selectedMode, setSelectedMode] = useState("foot-walking");

  const intervalRef = useRef(null);

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

  // Fetch shuttle stops once throughout the application lifetime.
  useEffect(() => {
    const fetchStops = async () => {
      if (!cachedShuttleStops) {
        try {
          const shuttle = await getShuttleStops();
          cachedShuttleStops = shuttle?.stops || [];
        } catch (error) {
          console.error("Error fetching shuttle stops:", error);
          cachedShuttleStops = [];
        }
      }
      setShuttleStops(cachedShuttleStops);
    };

    fetchStops();
  }, []);

  // Fetch directions when start and destination are available.
  useEffect(() => {
    if (start.location && destination.location) {
      fetchDirections();
    }
  }, [start, destination]);

  useEffect(() => {
    if (selectedMode === "concordia-shuttle") {
      busLocationService.startTracking(2000);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setShuttleLocations(busLocationService.getBusLocations());
      }, 2000);
    }
    if (selectedMode !== "concordia-shuttle" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setDirection(directionProfiles[selectedMode] || null);

    return () => {
      if (selectedMode === "concordia-shuttle") {
        busLocationService.stopTracking();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedMode, directionProfiles]);

  return (
    <View style={styles.container}>
      <NavigationHeader
        startAddress={start.civic_address}
        destinationAddress={destination.civic_address}
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
            legs={direction?.legs}
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

NavigationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      start: PropTypes.object,
      destination: PropTypes.object,
    }),
  }).isRequired,
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