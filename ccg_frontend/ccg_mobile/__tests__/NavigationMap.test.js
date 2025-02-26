/* eslint-disable @typescript-eslint/no-require-imports */

import React from 'react';
import { render } from '@testing-library/react-native';
import NavigationMap from '../components/navigation-screen-ui/sections/NavigationMap';

// Mock dependencies
jest.mock('react-native-maps', () => {
    const { View } = require('react-native');

    const MockMapView = (props) => {
        return <View testID="mock-map-view">{props.children}</View>;
    };

    MockMapView.Marker = () => <View testID="map-marker" />;
    MockMapView.Polyline = () => <View testID="map-polyline" />;

    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMapView.Marker,
        Polyline: MockMapView.Polyline,
    };
});

jest.mock('../utils/defaultLocations', () => ({
    getMyCurrentLocation: jest.fn().mockResolvedValue({
        location: {
            latitude: 45.495,
            longitude: -73.578,
        }
    })
}));

describe('NavigationMap Component', () => {
    const defaultProps = {
        start: {
            location: {
                latitude: 45.497,
                longitude: -73.579,
            },
            building_code: 'H',
            campus: 'SGW',
        },
        destination: {
            location: {
                latitude: 45.458,
                longitude: -73.640,
            },
            building_code: 'CC',
            campus: 'LOY',
        },
        bbox: [-73.65, 45.45, -73.57, 45.50], // [min_lng, min_lat, max_lng, max_lat]
        pathCoordinates: [
            {
                coordinates: [
                    [-73.579, 45.497],
                    [-73.580, 45.490],
                    [-73.640, 45.458],
                ]
            }
        ],
        legs: null,
        isNavigating: false,
        displayShuttle: false,
    };

    it('renders correctly with required props', () => {
        const { getByTestId, queryAllByTestId } = render(
            <NavigationMap {...defaultProps} />
        );

        // Map should be rendered
        expect(getByTestId('mock-map-view')).toBeTruthy();

        // Start and end markers should be rendered
        const markers = queryAllByTestId('map-marker');
        expect(markers.length).toBe(2); // Start and end markers

        // Route polyline should be rendered
        expect(queryAllByTestId('map-polyline').length).toBe(1);
    });

    it('renders correctly when in navigation mode', () => {
        const props = {
            ...defaultProps,
            isNavigating: true,
        };

        const { getByTestId } = render(
            <NavigationMap {...props} />
        );

        // Map should still be rendered in navigation mode
        expect(getByTestId('mock-map-view')).toBeTruthy();
    });

    it('renders correctly with shuttle display enabled', () => {
        const props = {
            ...defaultProps,
            displayShuttle: true,
            legs: {
                0: {
                    steps: [
                        {
                            coordinates: [
                                [-73.579, 45.497],
                                [-73.580, 45.490],
                            ],
                        },
                    ],
                    total_distance: 100,
                },
                1: {
                    steps: [
                        {
                            coordinates: [
                                [-73.590, 45.480],
                                [-73.640, 45.458],
                            ],
                        },
                    ],
                    total_distance: 200,
                },
            },
        };

        const { getByTestId } = render(
            <NavigationMap {...props} />
        );

        // Map should be rendered with shuttle display
        expect(getByTestId('mock-map-view')).toBeTruthy();
    });
});