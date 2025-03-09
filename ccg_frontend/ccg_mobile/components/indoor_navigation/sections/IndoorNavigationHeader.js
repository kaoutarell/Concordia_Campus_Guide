import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NavigationSearch from "../elements/NavigationSearch";
import CustomButton from "../elements/CustomButton";
import IndoorDropdown from "../elements/IndoorDropdown";

const IndoorNavigationHeader = ({
  buildings,
  selectedBuilding,
  onBuildingChange,
  startLocation,
  destination,
  onStartLocationChange,
  onDestinationChange,
}) => {
  const navigation = useNavigation();
  const [startAddress, setStartAddress] = useState(startLocation);
  const [destinationAddress, setDestinationAddress] = useState(destination);

  // Handle start and destination room code change
  const handleModifyAddress = (type, address) => {
    if (type === "start") {
      setStartAddress(address);
      onStartLocationChange(address); // start address to the parent component
    } else {
      setDestinationAddress(address);
      onDestinationChange(address); // destination address to the parent component
    }
  };

  const navigateToMapScreen = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container} testID="indoor-navigation-header-container">
      <View style={styles.rowContainer}>
        <CustomButton title="←" onPress={navigateToMapScreen} style={styles.button} testID="back-button" />
        <IndoorDropdown
          options={buildings}
          selectedValue={selectedBuilding}
          onValueChange={onBuildingChange}
          placeholder="Select Building"
          testID="indoor-dropdown"
        />
      </View>

      <NavigationSearch
        startAddress={startAddress}
        destinationAddress={destinationAddress}
        onModifyAddress={handleModifyAddress} // modified address handler
        allLocations={buildings}
        testID="navigation-search"
      />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    marginTop: "15%",
    height: "50%",
    width: "100%",
    paddingHorizontal: 10,
  },
  rowContainer: {
    marginTop: "10%",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 290,
  },
  button: {
    borderRadius: 60,
  },
});

export default IndoorNavigationHeader;
