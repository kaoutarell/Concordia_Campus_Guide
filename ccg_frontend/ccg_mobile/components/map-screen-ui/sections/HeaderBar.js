import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, ScrollView } from "react-native";
import MenuButton from "../elements/MenuButton";
import SearchBar from "../elements/SearchBar";
import CampusSelector from "../elements/CampusSelector";
import PropTypes from "prop-types";
import PointsOfInterestBar from "./PointsOfInterestBar";
import { Keyboard } from "react-native";

const HeaderBar = ({
  pointsOfInterest,
  selectedCampus,
  onCampusSelect,
  setSelectedCampus,
  locations,
  setAllLocations,
  setTargetLocation,
  resetLocations,
}) => {

  const [showPoiBar, setShowPoiBar] = useState(true);
  const [destination, setDestination] = useState("");
  const clearSearch = () => {
    setDestination("");
    setTargetLocation({});
    setSelectedCampus("SGW");
    setShowPoiBar(true);
    resetLocations();
    Keyboard.dismiss();
  };
  const animateSearch = (name) => {
    setDestination(name);
    setShowPoiBar(false);
  }

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
          destination={destination}
          setDestination={setDestination}
          clearSearch={clearSearch}
        />
        <CampusSelector
          testID="campus-selector"
          selectedCampus={selectedCampus}
          onCampusSelect={onCampusSelect}
          compact={true}
        />
      </View>
              {/*Points of Interest Bar */}
              {
          showPoiBar && (
                <View style={styles.poiContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
              <PointsOfInterestBar
                setAllLocations={setAllLocations}
                campus={selectedCampus}
                animateSearch={animateSearch}
              />
              </ScrollView>
              </View>
          )
        }

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
    poiContainer: {
    position: "relative",
    marginTop: 10, // Positioned under the HeaderBar
    flexDirection: "row",
    justifyContent: "space-around", // Space out buttons
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 10,
  },

});

export default HeaderBar;
