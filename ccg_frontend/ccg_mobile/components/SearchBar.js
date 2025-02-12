import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    FlatList,
    Text,
    Keyboard
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from '@expo/vector-icons/AntDesign';


const { width } = Dimensions.get("window");

const SearchBar = ({ locations, setIsSearching, setStartLocation, setDestinationLocation, handleViewNavigation}) => {
    const [isTyping, setIsTyping] = useState(false);
    const startInputOpacity = useRef(new Animated.Value(0)).current;
    const startInputTranslateY = useRef(new Animated.Value(10)).current;

    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(10)).current;

    const [destination, setDestination] = useState("");
    const [startPoint, setStartPoint] = useState("");
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [focusedInput, setFocusedInput] = useState(null);

    const locationNames = locations.map(location => location.name);

    useEffect(() => {
        if (destination.length > 0) {
            setIsTyping(true);
            Animated.parallel([
                Animated.timing(startInputOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(startInputTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(startInputOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(startInputTranslateY, {
                    toValue: 10,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonTranslateY, {
                    toValue: 10,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setIsTyping(false));
        }
    }, [destination]);

    const handleSearch = (text, type) => {
        if (text === "") setIsSearching(false);
        else setIsSearching(true);

        if (type === "destination") {
            setDestination(text);
            setFilteredLocations(
                text.length > 0
                    ? locationNames.filter(name => name.toLowerCase().includes(text.toLowerCase()))
                    : []
            );
        } else {
            setStartPoint(text);
            setFilteredLocations(
                text.length > 0
                    ? locationNames.filter(name => name.toLowerCase().includes(text.toLowerCase()))
                    : []
            );
        }
    };

    const handleSelect = (location, type) => {
        if (type === "destination") {
            setDestination(location);
        } else {
            setStartPoint(location);
        }
        setFilteredLocations([]);
        Keyboard.dismiss();
        setFocusedInput(null);
    };

    const handleSetLocations = () => {
        // setDestinationLocation(locations.find(location => location.name === destination))
        // setStartLocation(locations.find(location => location.name === startPoint))
        handleViewNavigation(locations.find(location => location.name === startPoint),locations.find(location => location.name === destination));
    };

    return (
        <>
        <View style={styles.container}>
            {isTyping && (
                <Animated.View style={[styles.searchContainer, {
                    opacity: startInputOpacity,
                    transform: [{ translateY: startInputTranslateY }]
                }]}>
                    <MaterialCommunityIcons name="target" size={20} color="#8B1D3B" style={styles.icon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Starting Point"
                        placeholderTextColor="#555"
                        value={startPoint}
                        onChangeText={(text) => handleSearch(text, "start")}
                        onFocus={() => setFocusedInput("start")}
                    />
                </Animated.View>
            )}

            {focusedInput === "start" && filteredLocations.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredLocations}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item, "start")} style={styles.suggestion}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <View style={styles.searchContainer}>
                <FontAwesome name="map-marker" size={20} color="#8B1D3B" style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Where to?"
                    placeholderTextColor="#555"
                    value={destination}
                    onChangeText={(text) => handleSearch(text, "destination")}
                    onFocus={() => setFocusedInput("destination")}
                />
            </View>

            {focusedInput === "destination" && filteredLocations.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredLocations}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item, "destination")} style={styles.suggestion}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    {isTyping && (
        <Animated.View style={[{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }]
        }]}>
            <TouchableOpacity style={styles.button} onPress={handleSetLocations}>
                <Text style={styles.buttonText}>Take me there</Text>
                <AntDesign style={styles.goIcon} name="arrowright" size={24} color="white" />
            </TouchableOpacity>
        </Animated.View>
    )}
    </>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        marginLeft: 30,
        width: width * 0.85,
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
        zIndex: 1,
    },
    icon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        width: width * 0.7
    },
    dropdown: {
        position: "absolute",
        top: 100,
        left: 10,
        right: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        maxHeight: 150,
        zIndex: 10,
        elevation: 10,
        overflow: "hidden",
        width: width * 0.6,
        alignSelf: "center",
    },
    suggestion: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#8B1D3B",
        color: "white",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 10,
        width: "310",
        alignSelf: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    goIcon: {
        marginLeft: 10,
    },
});

export default SearchBar;
