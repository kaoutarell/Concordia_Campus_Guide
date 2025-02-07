import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MenuButton from '../components/MenuButton';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');

describe('MenuButton', () => {
    it('renders correctly', () => {
        // Render the MenuButton component
        const { getByTestId } = render(<MenuButton />);

        // Query the button by test ID (assuming the MenuButton has testID="menu-button")
        const button = getByTestId('menu-button');

        // Check if the button is rendered correctly
        expect(button).toBeTruthy();
    });

    it('calls navigation.openDrawer on press', () => {
        // Create a mock function for openDrawer
        const openDrawer = jest.fn();

        // Mock useNavigation to return the mock openDrawer function
        useNavigation.mockReturnValue({ openDrawer });

        // Render the MenuButton component and trigger the press event
        const { getByTestId } = render(<MenuButton />);
        const button = getByTestId('menu-button');
        fireEvent.press(button);

        expect(openDrawer).toHaveBeenCalled();
    });
});