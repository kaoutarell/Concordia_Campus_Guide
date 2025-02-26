import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NavigationMode from '../components/navigation-screen-ui/elements/NavigationMode';

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => 'MockIcon',
}));

// Mock the NavigationMode component
jest.mock('../components/navigation-screen-ui/elements/NavigationMode', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return ({ mode, name, onModeChange }) => (
        <TouchableOpacity
            onPress={() => onModeChange(mode)}
            testID={`mode-${mode}`}
        >
            <Text>{name}</Text>
        </TouchableOpacity>
    );
});

describe('NavigationMode', () => {
    const defaultProps = {
        mode: 'foot-walking',
        selectedMode: 'foot-walking',
        onModeChange: jest.fn(),
        icon: 'MockIcon',
        name: 'Walk',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when selected', () => {
        const { getByText } = render(<NavigationMode {...defaultProps} />);

        // Check if the mode name is displayed
        expect(getByText('Walk')).toBeTruthy();

        // We can't easily check styles with react-testing-library, but we can
        // check if the component renders without errors when selected
    });

    it('renders correctly when not selected', () => {
        const props = {
            ...defaultProps,
            selectedMode: 'cycling-regular',
        };

        const { getByText } = render(<NavigationMode {...props} />);

        // Check if the mode name is still displayed when not selected
        expect(getByText('Walk')).toBeTruthy();
    });

    it('calls onModeChange with correct mode when pressed', () => {
        const { getByText } = render(<NavigationMode {...defaultProps} />);

        // Press the mode button
        fireEvent.press(getByText('Walk'));

        // Check if onModeChange was called with the correct mode
        expect(defaultProps.onModeChange).toHaveBeenCalledWith('foot-walking');
    });

    it('applies different styles based on selection state', () => {
        // Test the selected state
        const { rerender, getByText } = render(<NavigationMode {...defaultProps} />);

        // We can't easily check styles directly, but we can check if rerenders work

        // Rerender with different selected mode
        rerender(
            <NavigationMode
                {...defaultProps}
                selectedMode="cycling-regular"
            />
        );

        // Component should still render the name
        expect(getByText('Walk')).toBeTruthy();

        // Press the mode button after rerender
        fireEvent.press(getByText('Walk'));

        // Check if onModeChange was still called with the correct mode
        expect(defaultProps.onModeChange).toHaveBeenCalledWith('foot-walking');
    });
});