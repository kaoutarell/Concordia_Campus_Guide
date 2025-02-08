import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MenuButton from "./MenuButton";
import SearchBar from "./SearchBar";
import CampusSelector from "./CampusSelector";

const { width } = Dimensions.get("window");

const HeaderBar = ({ searchText, setSearchText, selectedCampus, onCampusSelect }) => {
    return (
        <View style={styles.headerContainer}>

            <View style={styles.topRow}>

                <MenuButton testID="menu-button"/>
                <View style={styles.topColumn}>

                    <SearchBar testID="search-bar" searchText={searchText} setSearchText={setSearchText} />
                    <CampusSelector testID="campus-selector" selectedCampus={selectedCampus} onCampusSelect={onCampusSelect} />
                </View>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {

        paddingTop: 60,
        paddingBottom: 10,
        backgroundColor: "white",
        width: "100%",
    },
    topColumn: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: width * 0.9, // Responsive width
    },

    topRow: {
        flexDirection: "row",
        width: width * 0.9, // Responsive width
    },
});

export default HeaderBar;
