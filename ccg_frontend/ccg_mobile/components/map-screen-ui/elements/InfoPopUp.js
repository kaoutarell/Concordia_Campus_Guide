import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import PropTypes from "prop-types";

const InfoPopup = ({ value, onClose, onGo }) => {
    return (
        <View style={styles.popupContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon} testID="close-popup-button">
                <Ionicons name="close" size={24} color="#8B1D3B" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Ionicons name="location" size={24} color="#8B1D3B" style={styles.headerIcon} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{value.name}</Text>
                    <Text style={styles.subtitle}>{value.building_code || ""}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
                {value.civic_address && (
                    <View style={styles.row}>
                        <Ionicons name="location-outline" size={20} color="#8B1D3B" />
                        <Text style={styles.text}>{value.civic_address}</Text>
                    </View>
                )}

                <View style={styles.row}>
                    <Ionicons name="business-outline" size={20} color="#8B1D3B" />
                    <Text style={styles.text}>Campus: {value.campus}</Text>
                </View>
            </View>

            {/* Amenities Section with enhanced design */}
            <View style={styles.amenitiesContainer}>
                {value.parking_lot !== undefined && (
                    <View style={styles.amenityCard}>
                        <Ionicons
                            name={value.parking_lot ? "checkmark-circle" : "close-circle"}
                            size={22}
                            color={value.parking_lot ? "#4CAF50" : "#F44336"}
                        />
                        <Text style={styles.amenityText}>Parking</Text>
                    </View>
                )}

                {value.accessibility !== undefined && (
                    <View style={styles.amenityCard}>
                        <Ionicons
                            name={value.accessibility ? "checkmark-circle" : "close-circle"}
                            size={22}
                            color={value.accessibility ? "#4CAF50" : "#F44336"}
                        />
                        <Text style={styles.amenityText}>Accessible</Text>
                    </View>
                )}

                {value.atm !== undefined && (
                    <View style={styles.amenityCard}>
                        <Ionicons
                            name={value.atm ? "checkmark-circle" : "close-circle"}
                            size={22}
                            color={value.atm ? "#4CAF50" : "#F44336"}
                        />
                        <Text style={styles.amenityText}>ATM</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => onGo(value)}
                style={styles.directionsButton}
                testID="get-directions-button"
            >
                <FontAwesome5 name="directions" size={20} color="white" />
                <Text style={styles.directionsText}>Get Directions</Text>
            </TouchableOpacity>
        </View>
    );
};

InfoPopup.propTypes = {
    value: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onGo: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    popupContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        width: '100%',
    },
    closeIcon: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 5,
        zIndex: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingRight: 30,
    },
    headerIcon: {
        marginRight: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 12,
    },
    infoSection: {
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    text: {
        marginLeft: 10,
        fontSize: 15,
        color: "#444",
    },
    amenitiesContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
        flexWrap: "wrap",
    },
    amenityCard: {
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        minWidth: 90,
        marginHorizontal: 4,
        marginBottom: 8,
    },
    amenityText: {
        fontSize: 13,
        fontWeight: "500",
        marginTop: 5,
        color: "#555",
    },
    directionsButton: {
        backgroundColor: "#8B1D3B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    directionsText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 10,
    },
});


export default InfoPopup;
