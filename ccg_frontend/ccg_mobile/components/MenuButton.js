import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

const MenuButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation?.openDrawer && navigation.openDrawer()}
        >
            <FontAwesome name="bars" size={24} color="#8B1D3B" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        padding: 10,
        marginLeft: 10,
    },
});

export default MenuButton;
