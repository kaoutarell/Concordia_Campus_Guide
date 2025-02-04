import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Marker } from "react-native-maps";

const CustomMarker = ({ coordinate, value, onPress }) => {
    return (
        <Marker
            coordinate={coordinate}
            onPress={() => {
                console.log("Marker Pressed:", value);
                onPress(); // Ensure the callback is called
            }}>
            <View style={styles.markerContainer}>
                <Image
                    source={require("../assets/marker-1.png")} // Your marker image
                    style={styles.markerImage}
                />
                <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>{value}</Text>
                </View>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    markerImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    valueContainer: {
        position: "absolute",
        top: 5,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    valueText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default CustomMarker;
