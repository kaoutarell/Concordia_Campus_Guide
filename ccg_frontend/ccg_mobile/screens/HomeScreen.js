import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.logo}>ConU CG</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Map")}>
                <Text style={styles.buttonText}>Continue to map ➤</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold" },
    logo: { fontSize: 32, fontWeight: "bold", color: "#8B1D3B" },
    button: { marginTop: 20, backgroundColor: "#F5D5CB", padding: 10, borderRadius: 10 },
    buttonText: { fontSize: 18, color: "#000" },
});
