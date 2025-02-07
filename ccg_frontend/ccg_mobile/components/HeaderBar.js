import React, {useEffect, useRef, useState} from "react";
import {View, StyleSheet, Dimensions, Animated} from "react-native";
import MenuButton from "./MenuButton";
import SearchBar from "./SearchBar";
import CampusSelector from "./CampusSelector";

const { width } = Dimensions.get("window");


const HeaderBar = ({selectedCampus, onCampusSelect, locations, setStartLocation, setDestinationLocation }) => {
    const [isSearching, setIsSearching] = useState(false);
    const campusOpacity = useRef(new Animated.Value(1)).current; // Default to visible
    const campusTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isSearching) {
            Animated.parallel([
                Animated.timing(campusOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(campusTranslateY, {
                    toValue: -10,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Show animation
            Animated.parallel([
                Animated.timing(campusOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(campusTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isSearching]);

    return (
        <View style={styles.headerContainer}>

            <View style={styles.topRow}>

                <MenuButton />
                <View style={styles.topColumn}>

                    <SearchBar setIsSearching={setIsSearching} setStartLocation={setStartLocation} setDestinationLocation={setDestinationLocation} locations={locations} />
                    <Animated.View style={{
                        opacity: campusOpacity,
                        transform: [{ translateY: campusTranslateY }],
                    }}>
                        <CampusSelector selectedCampus={selectedCampus} onCampusSelect={onCampusSelect} />
                    </Animated.View>

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
