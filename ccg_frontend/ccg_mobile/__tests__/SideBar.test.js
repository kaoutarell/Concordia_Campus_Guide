import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from '../components/map-screen-ui/sections/SideBar';
import { useNavigation } from '@react-navigation/native';


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


    // Test to verify that all menu items are rendered correctly
    it('renders all menu items', () => {
        const { getByText } = render(component);

        // check for each menu item
        expect(getByText('🏠 Home')).toBeTruthy();
        expect(getByText('🏛 Explore All Buildings')).toBeTruthy();
        expect(getByText('❓ Help')).toBeTruthy();
        expect(getByText('💬 Feedback')).toBeTruthy();
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
});
