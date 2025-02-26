import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import locationService from "../../../services/LocationService";
import CustomMarker from "../elements/CustomMarker.js";
import InfoPopup from "../elements/InfoPopUp.js";
import transformCurrentLoc from "../../../utils/transformCurrentLoc";
import BuildingHighlight from "../elements/BuildingHighlight";
import PropTypes from 'prop-types';

import { useNavigation } from "@react-navigation/native";


const MapViewComponent = ({ target, locations, region, maxBounds }) => {

  const navigation = useNavigation();

  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [targetRegion, setTargetRegion] = useState(region);

  // Function to check if the region is within the bounds
  const isWithinBounds = (region) => {
    return (
      region.latitude <= maxBounds.northeast.latitude &&
      region.latitude >= maxBounds.southwest.latitude &&
      region.longitude <= maxBounds.northeast.longitude &&
      region.longitude >= maxBounds.southwest.longitude
    );
  };

  // Function to handle region changes and restrict panning
  const handleRegionChange = (region) => {
    if (Platform.OS == "android") {
      const zoomThreshold = 0.006; // Adjust this value as needed
      setShowMarkers(region.latitudeDelta < zoomThreshold);
    }
    // else if (!isWithinBounds(region)) {
    //   mapRef.current.animateToRegion({
    //     latitude:
    //       (maxBounds.northeast.latitude + maxBounds.southwest.latitude) / 2,
    //     longitude:
    //       (maxBounds.northeast.longitude + maxBounds.southwest.longitude) / 2,
    //     latitudeDelta: Math.abs(
    //       maxBounds.northeast.latitude - maxBounds.southwest.latitude
    //     ),
    //     longitudeDelta: Math.abs(
    //       maxBounds.northeast.longitude - maxBounds.southwest.longitude
    //     ),
    //   });
    // }
  };



  const handleMarkerPress = (location) => {
    // Force React to update state asynchronously
    setTimeout(() => {
      setSelectedMarker((prev) => (prev === location ? null : location));
    }, 0);
  };

  const onGoToLocation = (location) => {
    navigation.navigate("Navigation", {
      start: null,
      destination: location,
      allLocations: locations
    })
  };

  useEffect(() => {
    if (locations.length > 0) {
      setIsLoading(false);
    }
  }, [locations]);

  useEffect(() => {

    const fetchLocation = async () => {
      try {
        await locationService.startTrackingLocation();
        const location = locationService.getCurrentLocation();
        if (location) setCurrentLocation(transformCurrentLoc(location));
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    };
    fetchLocation();

    return () => {
      locationService.stopTrackingLocation();
    };
  }, []);


  useEffect(() => {
    if (target?.id) {
      setMapKey(prevKey => prevKey + 1);
      setTargetRegion({
        latitude: target.location.latitude + 0.0009,
        longitude: target.location.longitude,
        latitudeDelta: 0.005, // Adjust for zoom level
        longitudeDelta: 0.005,
      });
      setSelectedMarker((prev) => (prev === target ? null : target));
    } else setTargetRegion(region)

  }, [target]);


  return (
    <SafeAreaView style={styles.container}>
      {/* Loading Indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            key={mapKey}
            ref={mapRef}
            testID="map-view" // added to enable getting the map by testID
            style={styles.map}
            region={targetRegion}
            maxBounds={maxBounds}
            showsUserLocation={true}
            onRegionChangeComplete={handleRegionChange}
            zoomControlEnabled={false}
            showsMyLocationButton={false}
            toolbarEnabled={false}
            onPress={() => setSelectedMarker(null)}
            {...(Platform.OS == "android" && {
              // Set the min and max zoom levels. Only supported on Android.
              maxZoomLevel: 19,
              minZoomLevel: 16,
            })}
            {...(Platform.OS == "ios" && {
              // Set the camera zoom range. Only supported on iOS 13+.
              cameraZoomRange: {
                minCenterCoordinateDistance: 500,
                maxCenterCoordinateDistance: 3000,
                animated: true,
              }
            })}
          >
            {(target.id) ?
              <CustomMarker
                key={target.id}
                value={target}
                onPress={() => handleMarkerPress(target)}
              />
              :
              (showMarkers != (Platform.OS == "ios")) && locations.map((location) => (
                <CustomMarker
                  key={location.id}
                  value={location}
                  onPress={() => handleMarkerPress(location)}
                />
              ))}

            {/* Display current location marker only if available */}
            {currentLocation?.coords && (
              <Marker
                coordinate={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                }}
                title="Current Location"
                pinColor="blue"
                testID="current-location-marker" // added for tests
              />
            )}

            <BuildingHighlight />

          </MapView>
        </View>
      )}

      {/* Display Info Popup when a marker is selected */}
      {selectedMarker !== null && (
        <View style={styles.popupWrapper}>
          <InfoPopup
            value={selectedMarker}
            onClose={() => setSelectedMarker(null)}
            onGo={onGoToLocation}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Avoid overlapping with the status bar
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  popupWrapper: {
    position: "absolute",
    bottom: 300, // Ensure it's above the bottom navigation (if any)
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
    elevation: 5, // For Android shadow
  },
});

MapViewComponent.propTypes = {
  locations: PropTypes.array.isRequired,
  region: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }).isRequired,
  maxBounds: PropTypes.shape({
    northeast: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    southwest: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default MapViewComponent;
