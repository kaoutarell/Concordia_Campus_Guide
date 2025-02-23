import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';


const NavigationSearch = ({ startAddress, destinationAddress, onStartSearching }) => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Start Address"
                    value={startAddress}
                    onChangeText={(text) => onStartSearching(text, "S")}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Destination Address"
                    value={destinationAddress}
                    onChangeText={(text) => onStartSearching(text, "D")}
                />
            </View>
        </View>
    );
};

export default NavigationSearch;


const { width } = Dimensions.get("window");

const styles = StyleSheet.create({

    searchContainer: {

        width: '80%',
        marginBottom: 10,
        zIndex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    icon: {
        marginRight: 1,
    },
    input: {
        width: '100%',
        height: 40,
        fontSize: 16,
        paddingVertical: 0,
    },
    navModesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
        padding: 5,
    },

    button: {
        padding: 10,
        backgroundColor: '#800020', // Burgundy
        borderRadius: 5,
        alignItems: 'center',
        color: 'white',
        fontSize: 14,
    },

});