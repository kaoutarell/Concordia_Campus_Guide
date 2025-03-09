import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ pointsOfInterest, allLocations, setTargetLocation, setSelectedCampus }) => {
  const navigation = useNavigation();
  const [destination, setDestination] = useState("");

  const clearSearch = () => {
    setDestination("");
    setTargetLocation({});
    setSelectedCampus("SGW");
    Keyboard.dismiss();
  };

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
          <TouchableOpacity testID="clear-search-button" onPress={clearSearch} style={styles.clearButton}>
            <FontAwesome name="times-circle" size={18} color="#8B1D3B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

SearchBar.propTypes = {
  pointsOfInterest: PropTypes.array.isRequired,
  allLocations: PropTypes.array.isRequired,
  setTargetLocation: PropTypes.func.isRequired,
  setSelectedCampus: PropTypes.func.isRequired,
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
});

export default SearchBar;
