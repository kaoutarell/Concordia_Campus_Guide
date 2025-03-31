import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import HomeScreen from "../components/home-screen-ui/HomeScreen";
import MapScreen from "../components/map-screen-ui/MapScreen";
import NavigationScreen from "../components/navigation-screen-ui/NavigationScreen";

import Sidebar from "../components/map-screen-ui/sections/SideBar";
import CustomNavSearch from "../components/navigation-screen-ui/CustomNavSearch";
import IndoorNavigationScreen from "../components/indoor-navigation-ui/IndoorNavigationScreen";

let Clarity;
let CalendarScreen = null;
// Check if the environment variable is set to disable native modules. If not, require the native module.
if (
  process.env.EXPO_PUBLIC_DISABLE_NATIVE_MODULES == null ||
  process.env.EXPO_PUBLIC_DISABLE_NATIVE_MODULES === "false"
) {
  Clarity = require("@microsoft/react-native-clarity");
  CalendarScreen = require("../components/calendar-screen-ui/CalendarScreen").default;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator inside Drawer
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Indoor" component={IndoorNavigationScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      {(process.env.EXPO_PUBLIC_DISABLE_NATIVE_MODULES == null ||
        process.env.EXPO_PUBLIC_DISABLE_NATIVE_MODULES === "false") && (
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      )}
      <Stack.Screen name="Navigation" component={NavigationScreen} />
      <Stack.Screen name="Search" component={CustomNavSearch} />
    </Stack.Navigator>
  );
};

const drawerContent = props => <Sidebar {...props} />;
const projectID = process.env.EXPO_PUBLIC_CLARITY_PROJECT_ID;

// Main App Navigator (Drawer + Stack)
export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
        if (Clarity) {
          const clarityConfig = {
            logLevel: Clarity.LogLevel.Verbose,
          };

          Clarity.initialize(projectID, clarityConfig);
          Clarity.setCurrentScreenName(routeNameRef.current);
        }
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          if (Clarity) {
            Clarity.setCurrentScreenName(currentRouteName);
          }
        }
      }}
    >
      <Drawer.Navigator drawerContent={drawerContent} screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Main" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
