import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get device dimensions

function Sidebar() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <Text style={styles.logo}>ConU CG</Text>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.menuItem}>🏠 Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Map")}>
                    <Text style={styles.menuItem}>🏛 Explore All Buildings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Navigation")}>
                    <Text style={styles.menuItem}>🚶‍♂️ Navigate</Text>

                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuItem}>❓ Help</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuItem}>💬 Feedback</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Adjust for status bar on Android
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.05, // Adjust based on screen width
    },
    logo: {
        fontSize: width * 0.07, // Scale logo size
        fontWeight: "bold",
        color: "#8B1D3B",
        textAlign: "center",
        marginBottom: height * 0.05, // Dynamic spacing
    },
    menuButton: {
        width: "100%", // Full width
        paddingVertical: height * 0.015, // Adjust touch area dynamically
        alignItems: "center",
        borderRadius: 10,
        marginBottom: height * 0.02, // Dynamic spacing
    },
    menuItem: {
        fontSize: width * 0.045, // Scale text size
        fontWeight: "bold",
        color: "#333",
    },
});

export default Sidebar;
