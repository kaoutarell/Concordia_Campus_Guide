import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Marker } from "react-native-maps";

const CustomMarker = ({ value, onPress }) => {
    return (
        <Marker
            coordinate={{
                latitude: value.location.latitude,
                longitude: value.location.longitude,
            }}
            onPress={() => {
                onPress();
            }}>
            <View style={styles.markerContainer}>
                <Image
                    source={require("../assets/marker-1.png")} // Your marker image
                    style={styles.markerImage}
                />
                <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>{value.building_code}</Text>
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
