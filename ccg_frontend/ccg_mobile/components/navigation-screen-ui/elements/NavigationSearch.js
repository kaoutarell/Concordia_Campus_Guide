import React from "react";
import {View, TextInput, TouchableOpacity} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/NavigationModesStyles';
import {useNavigation} from "@react-navigation/native";

const NavigationSearch = ({ startAddress, destinationAddress, onModifyAddress, onStartNavigation }) => {
    const navigation = useNavigation();

    const handlePress = (type) => {
        navigation.navigate("Search", {
            type,
            onGoBack: (selectedAddress) => type==="start" ? onModifyAddress("start", selectedAddress) : onModifyAddress("destination", selectedAddress),
        });
    }

    return (
        <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Start Address"
                    value={startAddress}
                    onChangeText={(text) => onStartNavigation(text)}
                    onFocus={()=> handlePress("start")}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Destination Address"
                    value={destinationAddress}
                    onChangeText={(text) => onStartNavigation(text)}
                    onFocus={()=> handlePress("destination")}
                />
            </View>
        </View>
    );
};

export default NavigationSearch;
