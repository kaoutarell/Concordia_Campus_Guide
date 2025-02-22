import React, { useMemo } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";
import BusMarker from "../../../assets/bus-marker.png";

const NavigationMap = ({
  start,
  destination,
  bbox,
  pathCoordinates,
  legs,
  shuttleLocations,
  shuttleStops,
  displayShuttle = false,
}) => {
  const fallbackCoordinates = useMemo(() => {
    if (!pathCoordinates) return [];
    return pathCoordinates.flatMap((element) =>
      element.coordinates.map((cord) => ({
        latitude: cord[1],
        longitude: cord[0],
      }))
    );
  }, [pathCoordinates]);

  // Combine all leg coordinates into a single array for shuttle mode,
  // or use fallback coordinates for non-shuttle mode
  const allCoordinates = useMemo(() => {
    if (displayShuttle && legs) {
      return Object.values(legs).reduce((acc, leg) => {
        if (leg.steps && Array.isArray(leg.steps)) {
          leg.steps.forEach((step) => {
            if (step.coordinates && Array.isArray(step.coordinates)) {
              const stepPoints = step.coordinates.map((cord) => ({
                latitude: cord[1],
                longitude: cord[0],
              }));
              acc = acc.concat(stepPoints);
            }
          });
        }
        return acc;
      }, []);
    }
    return fallbackCoordinates;
  }, [legs, displayShuttle, fallbackCoordinates]);

  const region = useMemo(
    () => ({
      latitude: (bbox[1] + bbox[3]) / 2,
      longitude: (bbox[0] + bbox[2]) / 2,
      latitudeDelta: Math.abs(bbox[3] - bbox[1]) * 1.2,
      longitudeDelta: Math.abs(bbox[2] - bbox[0]) * 1.2,
    }),
    [bbox]
  );

  const startMarker = { latitude: start?.location?.latitude, longitude: start?.location?.longitude };
  const endMarker = { latitude: destination?.location?.latitude, longitude: destination?.location?.longitude };

  const startTitle = displayShuttle ? (start?.campus || "Start") : start?.building_code;
  const endTitle = displayShuttle ? (destination?.campus || "End") : destination?.building_code;

  const intermediateMarkers = useMemo(() => {
    if (!legs || !displayShuttle) return [];

    // Convert legs object to an array and filter out legs with no distance.
    const legsArray = Object.values(legs).filter(leg => leg.total_distance !== 0);
    if (legsArray.length === 0) return [];

    const markers = [];

    // Get the first leg's end coordinate.
    const firstLeg = legsArray[0];
    if (firstLeg.steps && firstLeg.steps.length > 0) {
      const firstLegLastStep = firstLeg.steps[firstLeg.steps.length - 1];
      const endCoord = firstLegLastStep.coordinates?.slice(-1)[0];
      if (endCoord) {
        markers.push({
          latitude: endCoord[1],
          longitude: endCoord[0],
          title: "First Leg End",
        });
      }
    }

    // Get the last leg's beginning coordinate.
    const lastLeg = legsArray[legsArray.length - 1];
    if (lastLeg.steps && lastLeg.steps.length > 0) {
      const lastLegFirstStep = lastLeg.steps[0];
      const startCoord = lastLegFirstStep.coordinates?.[0];
      if (startCoord) {
        markers.push({
          latitude: startCoord[1],
          longitude: startCoord[0],
          title: "Last Leg Start",
        });
      }
    }

    return markers;
  }, [legs, displayShuttle]);


  return (
    <MapView style={styles.map} showsUserLocation region={region}>

      <Marker coordinate={startMarker} title={startTitle} pinColor="red" />
      <Marker coordinate={endMarker} title={endTitle} pinColor="red" />


      {intermediateMarkers.map((marker, index) => (
        <Marker key={`marker-${index}`} coordinate={marker} title={marker.title} pinColor="blue" />
      ))}

      {/* Render a single polyline for all coordinates */}
      <Polyline
        coordinates={allCoordinates}
        strokeColor="navy"
        strokeWidth={3}
      />

      <BusTrackingMarkers
        shuttleLocations={shuttleLocations}
        displayShuttle={displayShuttle}
      />
    </MapView>
  );
};

const BusTrackingMarkers = ({ shuttleLocations, displayShuttle }) => {
  if (!shuttleLocations || !displayShuttle) return null;

  return (
    <>
      {shuttleLocations.map((bus) => (
        <Marker
          key={bus.id}
          coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
          title={`Shuttle ${bus.id}`}
          pinColor="red"
          image={BusMarker}
        />
      ))}
    </>
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