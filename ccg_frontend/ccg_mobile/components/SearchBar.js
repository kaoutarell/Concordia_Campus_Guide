import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const { width } = Dimensions.get("window");

const SearchBar = ({ searchText, setSearchText, locations }) => {
    const [showSecondInput, setShowSecondInput] = useState(false);
    const secondInputOpacity = useRef(new Animated.Value(0)).current;
    const secondInputTranslateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        if (searchText.length > 0) {
            setShowSecondInput(true);
            Animated.parallel([
                Animated.timing(secondInputOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(secondInputTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(secondInputOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(secondInputTranslateY, {
                    toValue: 10,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowSecondInput(false));
        }
    }, [searchText]);

    const locationNames = locations.map(location => location.name);


    return (
        <View style={styles.container}>
            {/* Second Input (Animated) */}
            {showSecondInput && (
                <Animated.View style={[styles.searchContainer, {
                    opacity: secondInputOpacity,
                    transform: [{ translateY: secondInputTranslateY }]
                }]}>
                    <MaterialCommunityIcons name="target" size={20} color="#8B1D3B" style={styles.icon}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Starting Point"
                        placeholderTextColor="#555"
                    />
                </Animated.View>
            )}

            <View style={styles.searchContainer}>
                <FontAwesome name="map-marker" size={20} color="#8B1D3B" style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Where to?"
                    placeholderTextColor="#555"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: width * 0.85,
        alignSelf: "center",
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
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
