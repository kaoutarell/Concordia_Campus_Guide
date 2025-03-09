// NavigationFooter.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NavigationFooter from '../components/navigation-screen-ui/sections/NavigationFooter';
import { formatDuration } from '../utils';

// Mock the formatDuration function
jest.mock('../utils', () => ({
  formatDuration: jest.fn(seconds => {
    if (seconds <= 0) return "Now";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    return parts.join(", ");
  })
}));

// Mock DurationAndDistanceInfo component
jest.mock('../components/navigation-screen-ui/elements/DurationAndDistanceInfo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return jest.fn(({ duration, distance }) => (
    <View testID="duration-distance-info">
      <Text testID="duration-value">{duration}</Text>
      <Text testID="distance-value">{distance}</Text>
    </View>
  ));
});

describe('NavigationFooter component', () => {
  // Define common props
  const defaultProps = {
    onStartNavigation: jest.fn(),
    onShowDirections: jest.fn(),
    totalDuration: 1800, // 30 minutes
    totalDistance: 2500, // 2.5 km
  };

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders correctly with all props', () => {
    const { getByText, getByTestId } = render(<NavigationFooter {...defaultProps} />);
    
    // Test that DurationAndDistanceInfo is rendered
    const durationInfo = getByTestId('duration-distance-info');
    expect(durationInfo).toBeTruthy();
    
    // Test that buttons are rendered
    expect(getByText('Start Navigation')).toBeTruthy();
    expect(getByText('Preview')).toBeTruthy();
  });

  test('handles missing duration and distance props gracefully', () => {
    const propsWithoutDurationDistance = {
      onStartNavigation: jest.fn(),
      onShowDirections: jest.fn(),
    };
    
    const { getByTestId } = render(<NavigationFooter {...propsWithoutDurationDistance} />);
    
    // Check that DurationAndDistanceInfo is rendered
    expect(getByTestId('duration-distance-info')).toBeTruthy();
  });

  test('hides Start Navigation button when hideStartButton is true', () => {
    const { queryByText } = render(
      <NavigationFooter {...defaultProps} hideStartButton={true} />
    );
    
    // Start Navigation button should not be in the document
    expect(queryByText('Start Navigation')).toBeNull();
    
    // Preview button should still be there
    expect(queryByText('Preview')).toBeTruthy();
  });

  test('shows Start Navigation button by default', () => {
    const { getByText } = render(<NavigationFooter {...defaultProps} />);
    
    // Both buttons should be visible
    expect(getByText('Start Navigation')).toBeTruthy();
    expect(getByText('Preview')).toBeTruthy();
  });

  test('calls onStartNavigation when Start Navigation button is pressed', () => {
    const { getByText } = render(<NavigationFooter {...defaultProps} />);
    
    // Press the Start Navigation button
    fireEvent.press(getByText('Start Navigation'));
    
    // Check that the onStartNavigation function was called
    expect(defaultProps.onStartNavigation).toHaveBeenCalledTimes(1);
  });

  test('calls onShowDirections when Preview button is pressed', () => {
    const { getByText } = render(<NavigationFooter {...defaultProps} />);
    
    // Press the Preview button
    fireEvent.press(getByText('Preview'));
    
    // Check that the onShowDirections function was called
    expect(defaultProps.onShowDirections).toHaveBeenCalledTimes(1);
  });

  test('handles zero duration and distance', () => {
    const props = {
      ...defaultProps,
      totalDuration: 0,
      totalDistance: 0
    };
    
    const { getByTestId } = render(<NavigationFooter {...props} />);
    
    // Check that DurationAndDistanceInfo is rendered
    expect(getByTestId('duration-distance-info')).toBeTruthy();
  });

  test('handles very large duration and distance values', () => {
    const props = {
      ...defaultProps,
      totalDuration: 86400 * 2, // 2 days
      totalDistance: 100000 // 100 km
    };
    
    const { getByTestId } = render(<NavigationFooter {...props} />);
    
    // Check that DurationAndDistanceInfo is rendered
    expect(getByTestId('duration-distance-info')).toBeTruthy();
  });
  
  test('passes correct props to DurationAndDistanceInfo', () => {
    // Import the mocked component
    const DurationAndDistanceInfo = require('../components/navigation-screen-ui/elements/DurationAndDistanceInfo');
    
    render(<NavigationFooter {...defaultProps} />);
    
    // Check that DurationAndDistanceInfo was called with the correct props
    expect(DurationAndDistanceInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: defaultProps.totalDuration,
        distance: defaultProps.totalDistance
      }),
      expect.anything()
    );
  });
});