import React, { useMemo } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";
import BusMarker from "../../../assets/bus-marker.png";

const NavigationMap = ({
  start,
  destination,
  bbox,
  pathCoordinates,
  shuttleLocations,
  shuttleStops,
  displayShuttle = false,
}) => {
  // Memoize computed polyline coordinates for performance.
  const coordinates = useMemo(() => {
    if (!pathCoordinates) return [];
    return pathCoordinates.flatMap((element) =>
      element.coordinates.map((cord) => ({
        latitude: cord[1],
        longitude: cord[0],
      }))
    );
  }, [pathCoordinates]);

  // Memoize region calculation based on the bounding box.
  const region = useMemo(
    () => ({
      latitude: (bbox[1] + bbox[3]) / 2,
      longitude: (bbox[0] + bbox[2]) / 2,
      latitudeDelta: Math.abs(bbox[3] - bbox[1]) * 1.2, // add padding
      longitudeDelta: Math.abs(bbox[2] - bbox[0]) * 1.2, // add padding
    }),
    [bbox]
  );

  // Define start and end markers based on the displayShuttle flag.
  const startMarker = displayShuttle && shuttleStops && shuttleStops.length >= 1
    ? { latitude: shuttleStops[0].latitude, longitude: shuttleStops[0].longitude }
    : { latitude: start?.location?.latitude, longitude: start?.location?.longitude };

  const endMarker = displayShuttle && shuttleStops && shuttleStops.length >= 2
    ? { latitude: shuttleStops[1].latitude, longitude: shuttleStops[1].longitude }
    : { latitude: destination?.location?.latitude, longitude: destination?.location?.longitude };

  const startTitle = displayShuttle ? "SGW" : start?.building_code;
  const endTitle = displayShuttle ? "LOY" : destination?.building_code;

  return (
    <MapView style={styles.map} showsUserLocation region={region}>
      <Marker coordinate={startMarker} title={startTitle} pinColor="red" />
      <Marker coordinate={endMarker} title={endTitle} pinColor="red" />
      <Polyline
        coordinates={coordinates}
        strokeColor="navy"
        strokeWidth={3}
      />
      {shuttleLocations &&
        displayShuttle &&
        shuttleLocations.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
            title={`Shuttle ${bus.id}`}
            pinColor="red"
            image={BusMarker}
          />
        ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default NavigationMap;