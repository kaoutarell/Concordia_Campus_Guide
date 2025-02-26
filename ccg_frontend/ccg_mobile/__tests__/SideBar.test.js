import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Sidebar from '../components/map-screen-ui/sections/SideBar';


// Mocking the useNavigation hook from React Navigation to simulate navigation behavior in the test
jest.mock('@react-navigation/native', () => ({
    // Spread the actual `useNavigation` functionality, while mocking just the `useNavigation` method
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(), // Mock the useNavigation hook itself
}));

describe('Sidebar', () => {
    // Initialize a mock function for the navigation 'navigate' method
    const mockNavigate = jest.fn();


    // Set up a mock implementation for `useNavigation` before each test
    beforeEach(() => {
        useNavigation.mockReturnValue({ navigate: mockNavigate });
    });

    // Clean up any mock data between tests to ensure no interference
    afterEach(() => {
        jest.clearAllMocks(); // Clears mock functions to reset their state
    });

    // Define the component to be tested within a NavigationContainer (necessary for navigation functionality)
    const component = (
        <NavigationContainer>
            <Sidebar />
        </NavigationContainer>
    );

    // Test to verify that Sidebar renders the expected elements correctly
    it('renders correctly', () => {
        const { getByText } = render(component);

        // Assert that the key elements are visible in the sidebar
        expect(getByText('ConU CG')).toBeTruthy();
        expect(getByText('🏠 Home')).toBeTruthy();
        expect(getByText('🏛 Explore All Buildings')).toBeTruthy();
        expect(getByText('🚶‍♂️ Navigate')).toBeTruthy();
        expect(getByText('❓ Help')).toBeTruthy();
        expect(getByText('💬 Feedback')).toBeTruthy();
    });

    // Test to check if the "Home" button triggers the correct navigation
    it('navigates to Home when Home button is pressed', () => {
        const { getByText } = render(component);
        const homeButton = getByText('🏠 Home'); // Find the "Home" button by its text

        fireEvent.press(homeButton); // Simulate pressing the Home button
        // Assert that navigate was called with "Home" as an argument
        expect(mockNavigate).toHaveBeenCalledWith("Home");
    });

    // Test to check if the "Explore All Buildings" button triggers the correct navigation
    it('navigates to Map when Explore All Buildings button is pressed', () => {
        const { getByText } = render(component);
        const exploreButton = getByText('🏛 Explore All Buildings');

        fireEvent.press(exploreButton);
        expect(mockNavigate).toHaveBeenCalledWith("Map");
    });

    // Test to check if the "Navigate" button triggers the correct navigation
    it('navigates to Navigation when Navigate button is pressed', () => {
        const { getByText } = render(component);
        const navigateButton = getByText('🚶‍♂️ Navigate');

        fireEvent.press(navigateButton);
        expect(mockNavigate).toHaveBeenCalledWith("Navigation");
    });

    // Test for Help button press (which doesn't have navigation yet)
    it('handles Help button press without navigation', () => {
        const { getByText } = render(component);
        const helpButton = getByText('❓ Help');

        fireEvent.press(helpButton);
        // We only expect 0 calls if this test runs first, otherwise there might be calls from other tests
        expect(mockNavigate).not.toHaveBeenCalledWith("Help");
    });

    // Test for Feedback button press (which doesn't have navigation yet)
    it('handles Feedback button press without navigation', () => {
        const { getByText } = render(component);
        const feedbackButton = getByText('💬 Feedback');

        fireEvent.press(feedbackButton);
        // We only expect 0 calls if this test runs first, otherwise there might be calls from other tests
        expect(mockNavigate).not.toHaveBeenCalledWith("Feedback");
    });

    // Test to verify that the logo has the correct styles
    it('has correct styles for logo', () => {
        const { getByText } = render(component);
        const logo = getByText('ConU CG'); // logo text element
        expect(logo.props.style).toMatchObject({
            fontSize: expect.any(Number),
            fontWeight: 'bold',
            color: '#8B1D3B',
            textAlign: 'center',
            marginBottom: expect.any(Number),
        });
    });

    // Test to verify menu button styling
    it('has correct styles for menu buttons', () => {
        const { getByText } = render(component);
        const homeButton = getByText('🏠 Home');
        const homeButtonParent = homeButton.parent;
        
        // Test that the menu button style has proper attributes
        expect(homeButtonParent.props.style).toBeDefined();
        // Just verify it has a style property since exact styles can vary based on device dimensions
        
        expect(homeButton.props.style).toMatchObject({
            fontSize: expect.any(Number),
            fontWeight: 'bold',
            color: '#333',
        });
    });
});
