import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import HomeScreen from "../components/home-screen-ui/HomeScreen";
import MapScreen from "../components/map-screen-ui/MapScreen";
import NavigationScreen from "../components/navigation-screen-ui/NavigationScreen";

import Sidebar from "../components/map-screen-ui/sections/SideBar";
import CustomNavSearch from "../components/navigation-screen-ui/CustomNavSearch";
import CalendarScreen from "../components/calendar-screen-ui/CalendarScreen";
import IndoorNavigationScreen from "../components/indoor-navigation-ui/IndoorNavigationScreen";
//import * as Clarity from "@microsoft/react-native-clarity";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator inside Drawer
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Indoor" component={IndoorNavigationScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Navigation" component={NavigationScreen} />
      <Stack.Screen name="Search" component={CustomNavSearch} />
    </Stack.Navigator>
  );
};

const drawerContent = props => <Sidebar {...props} />;
//const projectID = process.env.EXPO_PUBLIC_CLARITY_PROJECT_ID;

// Main App Navigator (Drawer + Stack)
export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
        }
      }}
    >
      <Drawer.Navigator drawerContent={drawerContent} screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Main" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
