import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import MenuButton from "../elements/MenuButton";
import SearchBar from "../elements/SearchBar";
import CampusSelector from "../elements/CampusSelector";

const { width } = Dimensions.get("window");

const HeaderBar = ({
  selectedCampus,
  onCampusSelect,
  locations,
  setTargetLocation,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const campusOpacity = useRef(new Animated.Value(1)).current;
  const campusTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(campusOpacity, {
        toValue: isSearching ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(campusTranslateY, {
        toValue: isSearching ? -10 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSearching]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <MenuButton testID="menu-button" />
        <View style={styles.topColumn}>
          <SearchBar
            testID="search-bar"
            setTargetLocation={setTargetLocation}
            setIsSearching={setIsSearching}
            locations={locations}
            style={styles.inputField}
          />
          <Animated.View
            style={[
              styles.inputField,
              {
                opacity: campusOpacity,
                transform: [{ translateY: campusTranslateY }],
              },
            ]}
          >
            <CampusSelector
              testID="campus-selector"
              selectedCampus={selectedCampus}
              onCampusSelect={onCampusSelect}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  topColumn: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 12, //
    marginTop: 10,
    position: "relative",
    left: -10,
  },
  inputField: {
    width: "100%",
    marginBottom: 5,
  },
});

export default HeaderBar;
