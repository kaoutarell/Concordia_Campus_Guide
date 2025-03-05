import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, FlatList, Text, Keyboard } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const SearchBar = ({ pointsOfInterest, allLocations, setTargetLocation, setSelectedCampus }) => {
  const navigation = useNavigation();

  const [destination, setDestination] = useState("");

  const searchableItems = [
    ...allLocations.map(item => ({ ...item, id: `school-${item.id}` })),
    ...pointsOfInterest.map(item => ({ ...item, id: `poi-${item.id}` })),
  ];
  const handlePress = () => {
    navigation.navigate("Search", {
      searchableItems,
      type: "destination",
      onGoBack: selectedDestination => {
        setDestination(selectedDestination.name);
        setTargetLocation(selectedDestination);
        setSelectedCampus(selectedDestination.campus);
        Keyboard.dismiss();
      },
    });
  };

  const clearSearch = () => {
    setDestination("");
    setTargetLocation({});
    setSelectedCampus("SGW");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer]}>
        <FontAwesome name="map-marker" size={20} color="#8B1D3B" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where to?"
          placeholderTextColor="#555"
          value={destination}
          onFocus={() => handlePress()}
        />
        {destination.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <FontAwesome name="times-circle" size={18} color="#8B1D3B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

SearchBar.propTypes = {
  locations: PropTypes.array,
  setTargetLocation: PropTypes.func,
  setSelectedCampus: PropTypes.func,
};

// Improved Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "90%",
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 2,
    height: 24,
  },
  clearButton: {
    padding: 5,
  },
  dropdownContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    width: "100%",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    width: width * 0.7,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 5,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  noResultsContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: width * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B1D3B",
    marginBottom: 5,
  },
  tryAgainText: {
    fontSize: 14,
    color: "#666",
  },
});

export default SearchBar;
