import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SearchBar = ({ searchText, setSearchText }) => {
    return (
        <View style={styles.searchContainer}>
            <FontAwesome name="map-marker" size={20} color="#8B1D3B" style={styles.icon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Where to ?"
                placeholderTextColor="#555"
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 10,
        width: width * 0.8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    icon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
});

export default SearchBar;
