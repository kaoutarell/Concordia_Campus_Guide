import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../components/home-screen-ui/HomeScreen";
import MapScreen from "../components/map-screen-ui/MapScreen";
import NavigationScreen from "../components/navigation-screen-ui/NavigationScreen";
import { PostHogProvider } from "posthog-react-native";

import Sidebar from "../components/map-screen-ui/sections/SideBar";
import CustomNavSearch from "../components/navigation-screen-ui/CustomNavSearch";
import IndoorScreen from "../screens/IndoorScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator inside Drawer
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Indoor" component={IndoorScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Navigation" component={NavigationScreen} />
      <Stack.Screen name="Search" component={CustomNavSearch} />
    </Stack.Navigator>
  );
};

const drawerContent = props => <Sidebar {...props} />;

// Main App Navigator (Drawer + Stack)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
        options={{
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST_URL,
          autocapture: true,
          enableSessionReplay: true,
        }}
      >
        <Drawer.Navigator drawerContent={drawerContent} screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Main" component={StackNavigator} />
        </Drawer.Navigator>
      </PostHogProvider>
    </NavigationContainer>
  );
}
