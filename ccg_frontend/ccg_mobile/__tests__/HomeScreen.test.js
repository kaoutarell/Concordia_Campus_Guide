import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../components/home-screen-ui/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome text and logo', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    
    expect(getByText('Welcome to')).toBeTruthy();
    expect(getByText('ConU CG')).toBeTruthy();
  });

  it('renders continue to map button', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    
    expect(getByText('Continue to map ➤')).toBeTruthy();
  });

  it('navigates to Map screen when button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    
    const button = getByText('Continue to map ➤');
    fireEvent.press(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('Map');
  });

  // Test that all styles are applied correctly
  it('applies correct styles to components', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    
    const welcomeText = getByText('Welcome to');
    const logo = getByText('ConU CG');
    const button = getByText('Continue to map ➤');
    
    // We need to use the parent element to check button styles
    const buttonContainer = button.parent;
    
    // Check style attributes - this is more reliable than checking the style prop directly
    expect(welcomeText.props.style).toEqual(expect.objectContaining({ 
      fontSize: 24, 
      fontWeight: 'bold' 
    }));
    
    expect(logo.props.style).toEqual(expect.objectContaining({ 
      fontSize: 32, 
      fontWeight: 'bold', 
      color: '#8B1D3B' 
    }));
    
    // Verify the button container has a style
    expect(buttonContainer.props.style).toBeDefined();
    
    expect(button.props.style).toEqual({ 
      fontSize: 18, 
      color: '#000' 
    });
  });
});