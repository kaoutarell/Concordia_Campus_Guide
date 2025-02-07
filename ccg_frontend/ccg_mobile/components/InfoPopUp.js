import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons for better UX

const InfoPopup = ({ value, onClose, onGo }) => {


    return (
        <View style={styles.popupContainer}>
            {/* 🔥 Building Name */}
            <Text style={styles.title}>{value.name}</Text>
            <Text style={styles.subtitle}>Building Code: {value.building_code}</Text>

            {/* 📍 Address & Campus */}
            <View style={styles.row}>
                <Ionicons name="location-outline" size={20} color="#007AFF" />
                <Text style={styles.text}>{value.civic_address}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="business-outline" size={20} color="#007AFF" />
                <Text style={styles.text}>Campus: {value.campus}</Text>
            </View>

            {/* ✅ Amenities Section */}
            <View style={styles.amenitiesContainer}>
                <View style={styles.amenity}>
                    <Ionicons name={value.parking_lot ? "car" : "close-circle"} size={20} color={value.parking_lot ? "green" : "red"} />
                    <Text style={styles.amenityText}>Parking</Text>
                </View>

                <View style={styles.amenity}>
                    <Ionicons name={value.accessibility ? "accessibility" : "close-circle"} size={20} color={value.accessibility ? "green" : "red"} />
                    <Text style={styles.amenityText}>Accessible</Text>
                </View>

                <View style={styles.amenity}>
                    <Ionicons name={value.atm ? "cash-outline" : "close-circle"} size={20} color={value.atm ? "green" : "red"} />
                    <Text style={styles.amenityText}>ATM</Text>
                </View>
            </View>

            {/* 🔘 Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={[styles.button, styles.closeButton]}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onGo(value)} style={[styles.button, styles.goButton]}>
                    <Text style={styles.buttonText}>Go</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    popupContainer: {
        width: 250,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        elevation: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2,
    },
    text: {
        fontSize: 14,
        color: "#555",
        marginLeft: 8,
    },
    amenitiesContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 10,
    },
    amenity: {
        alignItems: "center",
    },
    amenityText: {
        fontSize: 12,
        color: "#555",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "#FF3B30",
    },
    goButton: {
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default InfoPopup;
