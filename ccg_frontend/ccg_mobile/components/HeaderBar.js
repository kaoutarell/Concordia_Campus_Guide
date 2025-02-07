import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MenuButton from "./MenuButton";
import SearchBar from "./SearchBar";
import CampusSelector from "./CampusSelector";

const { width } = Dimensions.get("window");

const HeaderBar = ({ searchText, setSearchText, selectedCampus, onCampusSelect, locations }) => {
    return (
        <View style={styles.headerContainer}>

            <View style={styles.topRow}>

                <MenuButton />
                <View style={styles.topColumn}>

                    <SearchBar searchText={searchText} setSearchText={setSearchText} locations={locations} />
                    {(!searchText &&
                    <CampusSelector selectedCampus={selectedCampus} onCampusSelect={onCampusSelect} />
                    )}
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
