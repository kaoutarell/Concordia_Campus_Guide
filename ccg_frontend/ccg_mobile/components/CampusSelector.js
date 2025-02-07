import React, { } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CampusSelector = ({ selectedCampus = "SGW", onCampusSelect }) => {

    const toggleCampus = () => {
        const newCampus = selectedCampus === "SGW" ? "LOY" : "SGW";
        onCampusSelect(newCampus);
    };

    return (
        <TouchableOpacity style={styles.campusButton} onPress={toggleCampus} testID="campus-button">
            <Text style={styles.campusText}>{selectedCampus}</Text>
            <FontAwesome name="chevron-down" size={14} color="white" style={styles.icon} testID="chevron-icon" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    campusButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#8B1D3B",
        color: "white",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 10,
        width: width * 0.8, // Responsive width
        alignSelf: "center",
    },
    campusText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    icon: {
        marginLeft: 10,
    },
});

export default CampusSelector;
