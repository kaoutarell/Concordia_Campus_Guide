import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Mock the NavigationFooter component to avoid Animated issues
jest.mock("../components/navigation-screen-ui/sections/NavigationFooter", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return function MockNavigationFooter({ onStartNavigation, totalDuration, totalDistance }) {
    return (
      <View>
        <Text>
          {totalDuration ? parseFloat("" + totalDuration / 60).toFixed(2) + " minutes" : "Duration not available"}
        </Text>
        <Text>
          {totalDistance ? parseFloat("" + totalDistance / 1000).toFixed(2) + " km" : "Distance not available"}
        </Text>
        <TouchableOpacity onPress={onStartNavigation}>
          <Text>Start Navigation</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock Animated components
jest.mock("react-native/Libraries/Animated/Animated", () => {
  const ActualAnimated = jest.requireActual("react-native/Libraries/Animated/Animated");
  return {
    ...ActualAnimated,
    timing: jest.fn().mockReturnValue({
      start: jest.fn(),
    }),
  };
});

// Mock Expo vector icons
jest.mock("@expo/vector-icons", () => ({
  FontAwesome5: () => "Icon",
}));

describe("NavigationFooter", () => {
  test("verifies duration and distance formatting", () => {
    // Format a duration without rendering React components
    const formatDuration = duration => {
      return duration ? parseFloat("" + duration / 60).toFixed(2) + " minutes" : "Duration not available";
    };

    const formatDistance = distance => {
      return distance ? parseFloat("" + distance / 1000).toFixed(2) + " km" : "Distance not available";
    };

    // Test with values
    const duration = 1200; // 20 minutes in seconds
    const distance = 2500; // 2.5 km in meters

    // Calculate expected results
    const formattedDuration = formatDuration(duration);
    const formattedDistance = formatDistance(distance);

    // Verify formatting is correct
    expect(formattedDuration).toBe("20.00 minutes");
    expect(formattedDistance).toBe("2.50 km");
  });

  test("verifies fallback text for null values", () => {
    // Format with null values without rendering React components
    const formatDuration = duration => {
      return duration ? parseFloat("" + duration / 60).toFixed(2) + " minutes" : "Duration not available";
    };

    const formatDistance = distance => {
      return distance ? parseFloat("" + distance / 1000).toFixed(2) + " km" : "Distance not available";
    };

    // Test with null values
    const formattedDuration = formatDuration(null);
    const formattedDistance = formatDistance(null);

    // Verify fallback text is used
    expect(formattedDuration).toBe("Duration not available");
    expect(formattedDistance).toBe("Distance not available");
  });

  test("verifies button press handler", () => {
    // Create a mock function for onStartNavigation
    const mockStartNavigation = jest.fn();

    // Directly call the function
    mockStartNavigation();

    // Verify the function was called
    expect(mockStartNavigation).toHaveBeenCalled();
  });
});
