import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import locationService from "../../../services/LocationService.js";
import CustomMarker from "../elements/CustomMarker.js";
import InfoPopup from "../elements/InfoPopUp.js";
import transformCurrentLoc from "../../../utils/transformCurrentLoc";
// import BuildingHighlight from "../elements/BuildingHighlight";
import BuildingHighlight from "../elements/BuildingHighlight";
import PropTypes from 'prop-types';
// Get screen width and height dynamically
const { width, height } = Dimensions.get("window");

const MapViewComponent = ({handleViewNavigation, target, locations, region,  maxBounds }) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);


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
      }else if (!isWithinBounds(region)) {
          // Snap back to the last valid region
          mapRef.current.animateToRegion({
            latitude: (maxBounds.northeast.latitude + maxBounds.southwest.latitude) / 2,
            longitude: (maxBounds.northeast.longitude + maxBounds.southwest.longitude) / 2,
            latitudeDelta: Math.abs(maxBounds.northeast.latitude - maxBounds.southwest.latitude),
            longitudeDelta: Math.abs(maxBounds.northeast.longitude - maxBounds.southwest.longitude),
          });
        }
    };

  const [mapKey, setMapKey] = useState(0);
  const [targetRegion, setTargetRegion] = useState(region);

  const startTemp =  {
    "accessibility": true,
    "atm": false,
    "bikerack": false,
    "building_code": "RF",
    "campus": "LOY",
    "civic_address": "7141 Sherbrooke W.",
    "departments_links": [],
    "id": 13,
    "infokiosk": false,
    "location": {
      "latitude": 45.458597012420455,
      "longitude": -73.64103401066905
    },
    "name": "Loyola Jesuit Hall and Conference Centre",
    "parking_lot": false,
    "services_links": [
      "{\"linkText\":\"Conference services\",\"linkPath\":\"/content/concordia/en/hospitality.html\",\"linkTarget\":true,\"itemClass\":\"\"}",
      "{\"linkText\":\"Loyola Jesuit Hall and Conference Centre\",\"linkPath\":\"/content/concordia/en/hospitality/hospitality-venues/loyola-jesuit-hall-conference-centre.html\",\"linkTarget\":true,\"itemClass\":\"\"}"
    ]
  }
  const destTemp =  {
    "accessibility": false,
    "atm": false,
    "bikerack": false,
    "building_code": "R",
    "campus": "SGW",
    "civic_address": "Your Location",
    "departments_links": [
      "{\"linkText\":\"Religions and Cultures\",\"linkPath\":\"/content/concordia/en/artsci/religions-cultures\",\"linkTarget\":true,\"itemClass\":\"\"}"
    ],
    "id": 50,
    "infokiosk": false,
    "location": {
      "latitude": 45.4968,
      "longitude": -73.5794
    },
    "name": "R Annex",
    "parking_lot": false,
    "services_links": []
  }



  const handleMarkerPress = (location) => {
    // Force React to update state asynchronously
    setTimeout(() => {
      setSelectedMarker((prev) => (prev === location ? null : location));
    }, 0);
  };

  const onGoToLocation = (destination) => {

    handleViewNavigation(destTemp, locations.find(location => location.id === destination.id));
  };

  useEffect(() => {
    if (locations.length > 0) {
      setIsLoading(false);
    }

  }, [locations]);

  useEffect(() => {
    // set Map boundaries. Only
    if (Platform.OS == "android" && mapRef.current) {
      // Set the map boundaries after the map has loaded
      mapRef.current.setMapBoundaries(
        maxBounds.northeast,
        maxBounds.southwest
      );
    }
  }, [maxBounds,mapRef.current]);

  useEffect(() => {

    const fetchLocation = async () => {
      try {
        await locationService.startTrackingLocation();
        const location = locationService.getCurrentLocation();
       if(location) setCurrentLocation(transformCurrentLoc(location));
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
        latitude: target.location.latitude+0.0009,
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
                (showMarkers != (Platform.OS =="ios")) && locations.map((location) => (
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
