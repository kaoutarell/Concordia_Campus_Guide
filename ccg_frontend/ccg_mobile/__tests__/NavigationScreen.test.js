/* eslint-disable @typescript-eslint/no-require-imports */

import React from 'react';
import { render } from '@testing-library/react-native';
import NavigationScreen from '../components/navigation-screen-ui/NavigationScreen';

jest.mock('../components/navigation-screen-ui/sections/NavigationMap', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="navigation-map" />;
});

jest.mock('../components/navigation-screen-ui/sections/NavigationHeader', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="navigation-header" />;
});

jest.mock('../components/navigation-screen-ui/sections/NavigationFooter', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="navigation-footer" />;
});

jest.mock('../components/navigation-screen-ui/sections/NavigationDirection', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="navigation-direction" />;
});

jest.mock('../components/navigation-screen-ui/sections/BusNavigationInfo', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="bus-navigation-info" />;
});

jest.mock('../components/navigation-screen-ui/sections/NavigationInfos', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="navigation-infos" />;
});

jest.mock('../components/navigation-screen-ui/sections/DirectionList', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="direction-list" />;
});

jest.mock('../api/dataService', () => ({
    getDirections: jest.fn().mockResolvedValue({
        steps: [
            {
                coordinates: [
                    [-73.579, 45.497],
                    [-73.580, 45.490],
                ],
            },
        ],
        total_distance: 100,
        total_duration: 500,
        bbox: [-73.65, 45.45, -73.57, 45.50],
    }),
    getBuildings: jest.fn().mockResolvedValue([
        {
            id: 1,
            name: 'Hall Building',
            location: {
                latitude: 45.497,
                longitude: -73.579,
            },
            building_code: 'H',
            campus: 'SGW',
            civic_address: '1455 De Maisonneuve Blvd W',
        },
        {
            id: 2,
            name: 'CC Building',
            location: {
                latitude: 45.458,
                longitude: -73.640,
            },
            building_code: 'CC',
            campus: 'LOY',
            civic_address: '7141 Sherbrooke St W',
        },
    ]),
}));

jest.mock('../services/LocationService', () => ({
    startTrackingLocation: jest.fn().mockResolvedValue(null),
    getCurrentLocation: jest.fn().mockReturnValue({
        coords: {
            latitude: 45.495,
            longitude: -73.578,
        }
    }),
    stopTrackingLocation: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
}));

jest.mock('../services/BusLocationService', () => ({
    startTracking: jest.fn(),
    stopTracking: jest.fn(),
    getBusLocations: jest.fn().mockReturnValue([
        { id: 1, latitude: 45.480, longitude: -73.600 },
    ]),
}));

jest.mock('../utils/defaultLocations', () => ({
    getMyCurrentLocation: jest.fn().mockResolvedValue({
        id: 'current',
        name: 'Current Location',
        location: {
            latitude: 45.495,
            longitude: -73.578,
        },
        civic_address: 'Current Location',
    }),
    getDefaultDestination: jest.fn().mockReturnValue({
        id: 1,
        name: 'Hall Building',
        location: {
            latitude: 45.497,
            longitude: -73.579,
        },
        building_code: 'H',
        campus: 'SGW',
        civic_address: '1455 De Maisonneuve Blvd W',
    }),
}));

jest.mock('../hooks/useRouteInstruction', () => ({
    useRouteInstruction: jest.fn().mockReturnValue({
        instruction: 'Continue straight',
        distance: 100,
    }),
}));

describe('NavigationScreen Component', () => {
    const mockNavigation = {
        goBack: jest.fn(),
        navigate: jest.fn(),
    };

    const mockRoute = {
        params: {
            start: {
                id: 'current',
                name: 'Current Location',
                location: {
                    latitude: 45.495,
                    longitude: -73.578,
                },
                civic_address: 'Current Location',
            },
            destination: {
                id: 1,
                name: 'Hall Building',
                location: {
                    latitude: 45.497,
                    longitude: -73.579,
                },
                building_code: 'H',
                campus: 'SGW',
                civic_address: '1455 De Maisonneuve Blvd W',
            },
            allLocations: [],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        const { getByText } = render(
            <NavigationScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        );

        expect(getByText('Loading locations...')).toBeTruthy();
    });

    it('renders with empty route params', () => {
        const emptyRoute = { params: undefined };

        const { getByText } = render(
            <NavigationScreen
                navigation={mockNavigation}
                route={emptyRoute}
            />
        );

        // Should still render but go into loading state
        expect(getByText('Loading locations...')).toBeTruthy();
    });
});