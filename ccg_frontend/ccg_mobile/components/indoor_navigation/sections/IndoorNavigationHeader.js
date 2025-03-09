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
  onModifyAddress,
  onDestinationChange,
  onStartDestinationSubmit,
}) => {
  const navigation = useNavigation();
  const [startAddress, setStartAddress] = useState(startLocation);
  const [destinationAddress, setDestinationAddress] = useState(destination);

  // Update the address in the parent component
  const handleModifyAddress = (type, address) => {
    if (type === "start") {
      setStartAddress(address); // Start address update
      onModifyAddress(address); // Pass to parent
    } else {
      setDestinationAddress(address); // Destination address update
      onDestinationChange(address); // Pass to parent
    }
  };

  const navigateToMapScreen = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <CustomButton title="←" onPress={navigateToMapScreen} style={styles.button} />
        <IndoorDropdown
          options={buildings}
          selectedValue={selectedBuilding}
          onValueChange={onBuildingChange}
          placeholder="Select Building"
        />
      </View>

      <NavigationSearch
        startAddress={startAddress}
        destinationAddress={destinationAddress}
        onModifyAddress={handleModifyAddress} // Handle both start and destination dynamically (without pressing any button)
        allLocations={buildings}
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
});

export default IndoorNavigationHeader;
