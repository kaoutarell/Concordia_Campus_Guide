import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import Sidebar from "../components/SideBar";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator inside Drawer
const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
    );
};

// Main App Navigator (Drawer + Stack)
export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <Sidebar {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Drawer.Screen name="Main" component={StackNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
