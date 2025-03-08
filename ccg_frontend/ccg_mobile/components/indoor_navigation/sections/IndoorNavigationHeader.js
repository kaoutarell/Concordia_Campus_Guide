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
}) => {
  const navigation = useNavigation();
  const [startAddress, setStartAddress] = useState(startLocation);
  const [destinationAddress, setDestinationAddress] = useState(destination);

  // Update the address in the parent component -- static for now
  const handleModifyAddress = (type, address) => {
    if (type === "start") {
      setStartAddress(address); // start address / static
    } else {
      setDestinationAddress(address); // destination address / static
    }
  };

  const navigateToMapScreen = () => {
    navigation.navigate("Map"); // Navigate to the MapScreen --> custom button return
  };

  return (
    <View style={styles.container}>
      {/* Row for back button and dropdown */}
      <View style={styles.rowContainer}>
        {/* Custom Button now navigates to the Map screen */}
        <CustomButton
          title="←"
          onPress={navigateToMapScreen}
          style={styles.button}
        />

        {/* Indoor Dropdown */}
        <IndoorDropdown
          options={buildings} // buildings are passed as an array here | temporary --> call buildings api (next)
          selectedValue={selectedBuilding}
          onValueChange={onBuildingChange}
          placeholder="Select Building"
        />
      </View>

      {/* Navigation Search Component */}
      <NavigationSearch
        startAddress={startAddress}
        destinationAddress={destinationAddress}
        onModifyAddress={handleModifyAddress} // should be dynamic - feature 3 || list of rooms available in the selected building?
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
  button: {
    padding: 10,
    backgroundColor: "#800020",
    borderRadius: 5,
    alignItems: "center",
    color: "white",
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 20,
    marginRight: 200,
  },
});

export default IndoorNavigationHeader;
