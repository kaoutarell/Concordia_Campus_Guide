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
      testID="menu-button"
    >
      <FontAwesome name="bars" size={24} color="#8B1D3B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    backgroundColor: "white", // White background
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});

export default MenuButton;
