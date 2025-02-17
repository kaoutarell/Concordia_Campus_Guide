import React, {useState, useEffect, use, useRef} from "react";
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
// import BuildingHighlight from "../elements/BuildingHighlight";
// Get screen width and height dynamically
const { width, height } = Dimensions.get("window");

const MapViewComponent = ({ target, locations, region }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [mapKey, setMapKey] = useState(0);
  const [targetRegion, setTargetRegion] = useState(region);


  const handleMarkerPress = (location) => {
    // Force React to update state asynchronously
    setTimeout(() => {
      setSelectedMarker((prev) => (prev === location ? null : location));
    }, 0);
  };

  const onGoToLocation = (location) => {
    console.log("Let's go to :", location.name);
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
        setCurrentLocation(location);
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    };
    fetchLocation();

    return () => {
      locationService.stopTrackingLocation();
    };
  }, []);

  const mapRef = useRef(null);

  const zoomIn = () => {
    if (!mapRef.current) return;

    if (target?.latitude && target?.longitude) {
      console.log("Smoothly zooming into:", target);

      mapRef.current.animateCamera(
          {
            center: {
              latitude: target.latitude,
              longitude: target.longitude,
            },
            zoom: 15, // Higher zoom for a closer view
            heading: 45, // No rotation
            pitch: 30, // Slight tilt for a better effect
          },
          { duration: 1500 } // Smooth transition duration (1.5 seconds)
      );
    }
  };


  useEffect(() => {
    if (target?.id) {
      setMapKey(prevKey => prevKey + 1);
      setTargetRegion({
        latitude: target.location.latitude,
        longitude: target.location.longitude,
        latitudeDelta: 0.005, // Adjust for zoom level
        longitudeDelta: 0.005,
      });
    }
    console.log("Region updated:", targetRegion);

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
            showsUserLocation={true}
            onPress={() => setSelectedMarker(null)}
            onMapReady={() => {
              mapRef.current?.fitToSuppliedMarkers([], { animated: false });
            }}
          >
            {(target.id) ?
                <CustomMarker
                    key={target.id}
                    value={target}
                    onPress={() => handleMarkerPress(target)}
                />
                :
                locations.map((location) => (
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
            {/* 
            <BuildingHighlight /> */}

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

export default MapViewComponent;
