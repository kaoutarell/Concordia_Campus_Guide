import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavigationSearch = ({ startAddress, destinationAddress, onModifyAddress }) => {
  const startAddressRef = useRef(null);
  const destinationAddressRef = useRef(null);

  const handlePress = type => {
    if (type === "start" && startAddressRef.current) {
      startAddressRef.current.focus();
    } else if (type === "destination" && destinationAddressRef.current) {
      destinationAddressRef.current.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.searchContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      testID="navigation-search-container"
    >
      <View style={styles.inputContainer}>
        <Ionicons name="chevron-down-circle-outline" size={20} color="#800020" style={styles.icon} />
        <TextInput
          testID="start-address-input"
          ref={startAddressRef}
          style={styles.input}
          placeholder="Start Address"
          value={startAddress}
          onChangeText={text => onModifyAddress("start", text)} // Updates parent but does NOT trigger API
          onFocus={() => handlePress("start")}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
        <TextInput
          testID="destination-address-input"
          ref={destinationAddressRef}
          style={styles.input}
          placeholder="Destination Address"
          value={destinationAddress}
          onChangeText={text => onModifyAddress("destination", text)} // updates parent WITHOUT triggering API - avoid sending endless useless api calls
          onFocus={() => handlePress("destination")}
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
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
    width: width * 0.8,
    height: 45,
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
  },
});

export default NavigationSearch;
