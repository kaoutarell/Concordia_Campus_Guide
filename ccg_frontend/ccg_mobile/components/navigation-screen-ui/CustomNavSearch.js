import React, { useState, useRef } from "react";
import { View, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Text, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getCategoryIcon } from "../../utils/categoryIcons";

const CustomNavSearch = ({ navigation, route }) => {
  const { type, onGoBack, searchableItems } = route.params || {};

  const [allBuildings, setAllBuildings] = useState(searchableItems);

  const [searchText, setSearchText] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(searchableItems);

  const inputRef = useRef(null);

  const handleSearch = text => {
    setSearchText(text);

    if (text.length > 0) {
      const filtered = allBuildings.filter(
        loc =>
          loc.name.toLowerCase().includes(text.toLowerCase()) ||
          loc.civic_address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleSelectLocation = location => {
    Keyboard.dismiss();
    setSearchText(location.name);
    //reminder that onGoBack returns actual location object
    if (onGoBack) {
      onGoBack(location);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#800020" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={type === "destination" ? "Choose destination" : "Choose start"}
          value={searchText}
          returnKeyType="done"
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        keyboardShouldPersistTaps="handled"
        data={filteredLocations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectLocation(item)}>
            {/* Icon */}
            <Image source={getCategoryIcon(item.category)} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.buildingName}>{item.name}</Text>
              <Text style={styles.address}>{item.civic_address || "No address available"}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#800020",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#800020",
  },
  buildingName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  address: {
    fontSize: 14,
    fontStyle: "italic",
    color: "gray",
  },
});

export default CustomNavSearch;
