import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavigationSearch = ({
  startAddress,
  destinationAddress,
  onModifyAddress,
}) => {
  const startAddressRef = useRef(null); // Ref for the start address input
  const destinationAddressRef = useRef(null); // Ref for the destination address input

  const handlePress = (type) => {
    // Focus the appropriate input field when either is clicked
    if (type === "start" && startAddressRef.current) {
      startAddressRef.current.focus(); // Show the keyboard for start address
    } else if (type === "destination" && destinationAddressRef.current) {
      destinationAddressRef.current.focus(); // Show the keyboard for destination address
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.searchContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Start Address */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="chevron-down-circle-outline"
          size={20}
          color="#800020"
          style={styles.icon}
        />
        <TextInput
          ref={startAddressRef} // Assign ref to start address
          style={styles.input}
          placeholder="Start Address"
          value={startAddress} // Display current start address
          onChangeText={(text) => onModifyAddress("start", text)} // Update onChange
          onFocus={() => handlePress("start")} // Trigger any action on focus
        />
      </View>

      {/* Destination Address */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="location-outline"
          size={20}
          color="#800020"
          style={styles.icon}
        />
        <TextInput
          ref={destinationAddressRef} // Assign ref to destination address
          style={styles.input}
          placeholder="Destination Address"
          value={destinationAddress} // Display current destination address
          onChangeText={(text) => onModifyAddress("destination", text)} // Update onChange
          onFocus={() => handlePress("destination")} // Trigger any action on focus
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    zIndex: 1,
    alignItems: "center", // Center align the inputs
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
    width: width * 0.8, // Ensure inputs have a consistent width
    height: 45, // Same height for all input fields
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    width: 250,
    borderRadius: 24,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row", // Align text and icon horizontally
    justifyContent: "space-between",
  },
});

export default NavigationSearch;
