import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import MenuButton from "../elements/MenuButton";
import SearchBar from "../elements/SearchBar";
import CampusSelector from "../elements/CampusSelector";
import PropTypes from "prop-types";

const HeaderBar = ({ pointsOfInterest, selectedCampus, onCampusSelect, setSelectedCampus, locations, setTargetLocation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MenuButton testID="menu-button" />
        <SearchBar
          testID="search-bar"
          setTargetLocation={setTargetLocation}
          allLocations={locations}
          pointsOfInterest={pointsOfInterest}
          setSelectedCampus={setSelectedCampus}
        />
        <CampusSelector
          testID="campus-selector"
          selectedCampus={selectedCampus}
          onCampusSelect={onCampusSelect}
          compact={true}
        />
      </View>
    </View>
  );
};

HeaderBar.propTypes = {
  selectedCampus: PropTypes.string.isRequired,
  onCampusSelect: PropTypes.func.isRequired,
  setSelectedCampus: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
  setTargetLocation: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: "100%",
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HeaderBar;
