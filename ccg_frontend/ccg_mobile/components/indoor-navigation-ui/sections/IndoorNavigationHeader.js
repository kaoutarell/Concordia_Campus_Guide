import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NavigationSearch from "../elements/NavigationSearch";
import CustomButton from "../elements/CustomButton";
import PropTypes from "prop-types";

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
        <NavigationSearch
          startAddress={startAddress}
          destinationAddress={destinationAddress}
          onModifyAddress={handleModifyAddress} // modified address handler
          allLocations={buildings}
          testID="navigation-search"
        />
      </View>
    </View>
  );
};

IndoorNavigationHeader.propTypes = {
  buildings: PropTypes.array.isRequired,
  selectedBuilding: PropTypes.any.isRequired,
  onBuildingChange: PropTypes.func.isRequired,
  startLocation: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  onStartLocationChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingTop: "15%",
    width: "100%",
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 290,
  },
  button: {
    borderRadius: 60,
  },
});

export default IndoorNavigationHeader;
