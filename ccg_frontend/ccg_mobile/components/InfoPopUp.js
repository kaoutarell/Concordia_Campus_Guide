import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons for better UX
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const InfoPopup = ({ value, onClose, onGo }) => {


    return (
        <View style={styles.popupContainer}>
            {/* ❌ Close Button (X Icon) */}
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

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

            {/* 🔘 Go Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onGo(value)} style={[styles.button, styles.goButton]}>
                    <View style={styles.row}>
                        <FontAwesome5 name="directions" size={24} color="white" />
                        <Text style={styles.buttonText}>Directions</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = {
    popupContainer: {
        position: "relative",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    closeIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    text: {
        marginLeft: 5,
        fontSize: 16,
    },
    amenitiesContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    amenity: {
        alignItems: "center",
    },
    amenityText: {
        fontSize: 14,
        marginTop: 2,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    goButton: {
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
};


export default InfoPopup;
