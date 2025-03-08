// components/DirectionsList.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import PropTypes from "prop-types";
/**
 * DirectionsList: displays a list of route steps with distance and instruction.
 *
 * @param {Array} steps - array of objects, each containing:
 *   {
 *     distance: number,
 *     duration: number,
 *     instruction: string,
 *     type: number,
 *     coordinates: Array<[lng, lat]>
 *   }
 */
export default function DirectionsList({ steps }) {
  const formatDistance = distance => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    } else {
      return `${distance.toFixed(1)} m`;
    }
  };

  const renderStep = ({ item }) => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.distance}>{formatDistance(item.distance)}</Text>
        <Text style={styles.instruction}>{item.instruction}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Directions</Text>
      <FlatList
        data={steps != null ? steps : []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderStep}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

DirectionsList.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      distance: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      instruction: PropTypes.string.isRequired,
      type: PropTypes.number.isRequired,
      coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    })
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 60,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
  },
  distance: {
    fontWeight: "bold",
    marginRight: 8,
  },
  instruction: {
    flex: 1,
    flexWrap: "wrap",
  },
});
