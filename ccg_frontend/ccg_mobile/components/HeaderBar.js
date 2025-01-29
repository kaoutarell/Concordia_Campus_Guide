import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

// Get screen width and height
const { width, height } = Dimensions.get('window');

const HeaderBar = ({ searchText, setSearchText, selectedCampus, setSelectedCampus }) => {
    return (
        <View style={styles.header}>
            {/* Menu Button */}
            <TouchableOpacity style={styles.menuButton}>
                <FontAwesome name="bars" size={width * 0.07} color="white" />
            </TouchableOpacity>

            {/* Search Input */}
            <TextInput
                style={styles.searchBar}
                placeholder="Where to?"
                placeholderTextColor="#555"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Campus Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedCampus}
                    style={styles.campusPicker}
                    onValueChange={(itemValue) => setSelectedCampus(itemValue)}
                    dropdownIconColor="black" // For better visibility
                >
                    <Picker.Item label="SGW Campus" value="SGW" />
                    <Picker.Item label="Loyola Campus" value="Loyola" />
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: height * 0.05, // Adjusted dynamically
        left: width * 0.04,
        right: width * 0.04,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly darker for contrast
        borderRadius: width * 0.05, // Rounded corners
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        elevation: 5, // Shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    menuButton: {
        padding: width * 0.02,
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: width * 0.04,
        paddingHorizontal: width * 0.04,
        height: height * 0.05,
        fontSize: width * 0.04,
        color: '#000',
        marginHorizontal: width * 0.02,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: width * 0.04,
        overflow: 'hidden',
        width: width * 0.35,
        height: height * 0.05,
        justifyContent: 'center',
    },
    campusPicker: {
        width: '100%',
        height: '100%',
        color: '#000',
    },
});

export default HeaderBar;
