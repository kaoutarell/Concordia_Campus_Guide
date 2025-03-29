import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Button, StatusBar, ActivityIndicator, Text, Modal } from "react-native";
import PropTypes from "prop-types";
import NavigationFooter from "./sections/NavigationFooter";
import NavigationMap from "./sections/NavigationMap";
import { getDirections, getBuildings } from "../../api/dataService";

import NavigationHeader from "./sections/NavigationHeader";
import NavigationDirection from "./sections/NavigationDirection";
import BusNavigationInfo from "./sections/BusNavigationInfo";
import NavigationInfos from "./sections/NavigationInfos";
import DirectionsList from "./sections/DirectionList";
import busLocationService from "../../services/BusLocationService";

import locationService from "../../services/LocationService";

import { useRouteInstruction } from "../../hooks/useRouteInstruction";

import { getMyCurrentLocation, getDefaultDestination } from "../../utils/defaultLocations";

const NavigationScreen = ({ navigation, route }) => {
  const params = route.params || {};

  const [startPoint, setStartPoint] = useState(params.start || null);
  const [destinationPoint, setDestinationPoint] = useState(params.destination || null);

  //gets school buildings + points of interest
  const [allLocations, setAllLocations] = useState(params.allLocations || []);

  const [direction, setDirection] = useState(null);

  const [selectedMode, setSelectedMode] = useState("foot-walking");

  const [loading, setLoading] = useState(true);

  const [isNavigating, setIsNavigating] = useState(false);

  const [searchText, setSearchText] = useState({
    startAddress: "",
    destinationAddress: "",
  });

  const [showDirections, setShowDirections] = useState(false);
  const [shuttleLocations, setShuttleLocations] = useState([]);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (allLocations.length === 0) {
      fetchAllLocations();
    }
    if (startPoint != null && destinationPoint != null) fetchDirections();
    else setDefaultStartAndDestination();
  }, [startPoint, destinationPoint, selectedMode, isNavigating]);

  useEffect(() => {
    // Start tracking location using the service
    locationService.startTrackingLocation().catch(err => {
      console.error("Location tracking error:", err.message);
    });

    // Subscribe to location updates
    const handleLocationUpdate = location => {
      setUserLocation([location.coords.longitude, location.coords.latitude]);
    };

    locationService.subscribe(handleLocationUpdate);

    // Clean up on unmount: unsubscribe and stop tracking
    return () => {
      locationService.unsubscribe(handleLocationUpdate);
      locationService.stopTrackingLocation();
    };
  }, []);

  const { instruction, distance } = useRouteInstruction(direction, userLocation);

  // Ensure the 'direction' is fetched with the correct start and destination points - bug#166
  useEffect(() => {
    if (startPoint && destinationPoint) {
      fetchDirections();
    }
  }, [startPoint, destinationPoint, selectedMode]);

  const handleModeSelect = mode => {
    setSelectedMode(mode);
  };

  const fetchAllLocations = async () => {
    //gets the buildings of both campus for the purpose of getting directions from one campus to the other
    try {
      const data = await getBuildings();
      setAllLocations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onModifyAddress = async (type, location) => {
    const currentLocation = await getMyCurrentLocation();
    if (type === "destination") {
      if (location === null) {
        setDestinationPoint(currentLocation);
      } else setDestinationPoint(location);
    } else {
      setStartPoint(location);
    }
  };

  // needs to check destination point but we need to implement the search bar first
  const startNavigation = async () => {
    // when navigating, set the start point to the current location
    if (startPoint) {
      setIsNavigating(true);
    } else {
      const currentLocation = await getMyCurrentLocation();
      setStartPoint(currentLocation);
      setIsNavigating(true);
    }
  };

  const onExitNavigation = () => {
    setIsNavigating(false);
  };

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const data = await getDirections(
        selectedMode,
        [startPoint?.location.longitude, startPoint?.location.latitude],
        [destinationPoint?.location.longitude, destinationPoint?.location.latitude]
      );
      setDirection(data);
      setSearchText({
        startAddress: startPoint?.civic_address,
        destinationAddress: destinationPoint?.civic_address,
      });
      setLoading(false);
    } catch (error) {
      setDirection([]);
      console.error("Error fetching: ", error);
    }
  };

  // Updated effect for shuttle mode using observer instead of setInterval polling.
  useEffect(() => {
    if (selectedMode === "concordia-shuttle") {
      busLocationService.startTracking(2000);
      const updateShuttleLocations = locations => {
        setShuttleLocations(locations);
      };
      busLocationService.attach(updateShuttleLocations);
      return () => {
        busLocationService.detach(updateShuttleLocations);
        busLocationService.stopTracking();
      };
    }

    if (startPoint != null && destinationPoint != null) {
      fetchDirections();
    }
  }, [selectedMode, startPoint, destinationPoint]);

  const setDefaultStartAndDestination = async () => {
    try {
      let currentLocation;
      let defaultDestination;
      if (startPoint == null) {
        currentLocation = await getMyCurrentLocation();
        setStartPoint(currentLocation);
        setSearchText(prev => ({
          ...prev,
          startAddress: currentLocation.civic_address,
        }));
      }
      if (destinationPoint == null) {
        currentLocation = await getMyCurrentLocation();
        defaultDestination = getDefaultDestination();
        setDestinationPoint(defaultDestination);
        setSearchText(prev => ({
          ...prev,
          destinationAddress: defaultDestination.civic_address,
        }));
      }
    } catch (error) {
      console.error("Error setting default location: ", error);
    }
  };

  const renderNavigationInfo = () => {
    if (!isNavigating) {
      if (direction && selectedMode === "concordia-shuttle") {
        return (
          <BusNavigationInfo
            totalDistance={direction.total_distance}
            totalDuration={direction.total_duration}
            onStartNavigation={startNavigation}
          />
        );
      } else {
        // checking if the startPoint is the current location to conditionally hide "Start Navigation" button
        const isStartLocationCurrent =
          Math.abs(startPoint?.location?.longitude - userLocation?.[0]) < 0.0001 &&
          Math.abs(startPoint?.location?.latitude - userLocation?.[1]) < 0.0001;

        return (
          <NavigationFooter
            totalDistance={direction?.total_distance}
            totalDuration={direction?.total_duration}
            onStartNavigation={startNavigation}
            onShowDirections={() => setShowDirections(true)}
            hideStartButton={!isStartLocationCurrent} // here is the condition to hide the start button
          />
        );
      }
    } else {
      return (
        <NavigationInfos
          totalDistance={direction?.total_distance}
          totalDuration={direction?.total_duration}
          onExit={onExitNavigation}
          onShowDirections={() => setShowDirections(true)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={showDirections} animationType="slide" onRequestClose={() => setShowDirections(false)}>
        <View style={{ flex: 1 }}>
          {/* Absolutely positioned button in the top-left corner */}
          <View style={styles.closeButtonContainer}>
            <Button title="←" onPress={() => setShowDirections(false)} />
          </View>

          <DirectionsList steps={direction?.steps} />
        </View>
      </Modal>

      {!isNavigating ? (
        <NavigationHeader
          startAddress={searchText.startAddress}
          destinationAddress={searchText.destinationAddress}
          onSelectedMode={handleModeSelect}
          allLocations={allLocations}
          onBackPress={() => navigation.goBack()}
          selectedMode={selectedMode}
          onModifyAddress={onModifyAddress}
        />
      ) : (
        <NavigationDirection distance={distance} instruction={instruction} />
      )}
      {/* Map Container (Center) */}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#800020" />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : (
        <View style={styles.mapContainer(isNavigating)}>
          {direction != null && (
            <NavigationMap
              start={startPoint}
              destination={destinationPoint}
              pathCoordinates={direction.steps}
              bbox={direction.bbox}
              isNavigating={isNavigating}
              legs={direction?.legs}
              displayShuttle={selectedMode === "concordia-shuttle"}
              shuttleLocations={shuttleLocations}
            />
          )}
        </View>
      )}

      {renderNavigationInfo()}
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
  mapContainer: isNavigating => ({
    height: isNavigating ? "70%" : "60%", // Dynamic height based on isNavigating
    width: "100%",
  }),

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonContainer: {
    position: "absolute",
    fontSize: 94,
    top: 50, // adjust for your needs, or use SafeAreaView on iOS
    left: 16,
    zIndex: 999, // ensure the button stays on top of other content
  },
});

export default NavigationScreen;
