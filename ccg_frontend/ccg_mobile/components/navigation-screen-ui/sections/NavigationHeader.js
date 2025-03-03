import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { modes } from "../../../constants/TransportModes";

import NavigationSearch from "../elements/NavigationSearch";
import CustomButton from "../elements/CustomButton";
import NavigationMode from "../elements/NavigationMode";

const NavigationHeader = ({
  startAddress,
  destinationAddress,
  onSelectedMode,
  onModifyAddress,
  selectedMode,
  allLocations,
  onBackPress,
}) => {
  const handleModeChange = mode => {
    onSelectedMode(mode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <CustomButton title="←" onPress={onBackPress} style={styles.button} />

        <NavigationSearch
          startAddress={startAddress}
          destinationAddress={destinationAddress}
          onBackPress={onBackPress}
          onModifyAddress={onModifyAddress}
          allLocations={allLocations}
        />
      </View>

      {/* Navigation Modes at the top */}
      <View style={styles.navModesContainer}>
        {modes.map(({ mode, name, icon }) => (
          <NavigationMode
            key={name}
            mode={mode}
            name={name}
            icon={icon}
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
            style={[styles.navMode, selectedMode === mode ? styles.activeMode : null]} // Conditionally apply active style
          />
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    marginTop: "15%",
    height: "22%", // Ajustez la hauteur de la carte selon vos besoins
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "#fff",
    height: 45, // Ensures a good clickable area
  },
  navModesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    padding: 5,
  },
  navMode: {
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.14,
  },
  inputSwapContainer: {
    position: "relative", // Ensures correct positioning for swap button
  },
  activeMode: {
    backgroundColor: "#800020",
  },
  button: {
    padding: 10,
    backgroundColor: "#800020", // Burgundy
    borderRadius: 5,
    alignItems: "center",
    color: "white",
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-betwwen",
  },
});

export default NavigationHeader;
