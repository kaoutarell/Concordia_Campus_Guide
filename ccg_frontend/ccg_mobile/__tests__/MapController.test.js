import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapController from '../components/map-screen-ui/elements/MapController';


describe('MapController', () => {
    const mockOnCurrentLocation = jest.fn();
    const mockOnZoomIn = jest.fn();
    const mockOnZoomOut = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const { getByTestId } = render(
            <MapController
                onCurrentLocation={mockOnCurrentLocation}
                onZoomIn={mockOnZoomIn}
                onZoomOut={mockOnZoomOut}
            />
        );

        expect(getByTestId('locate-button')).toBeTruthy();
        expect(getByTestId('zoom-in-button')).toBeTruthy();
        expect(getByTestId('zoom-out-button')).toBeTruthy();
    });

    it('should call onCurrentLocation when locate button is pressed', () => {
        const { getByTestId } = render(
            <MapController
                onCurrentLocation={mockOnCurrentLocation}
                onZoomIn={mockOnZoomIn}
                onZoomOut={mockOnZoomOut}
            />
        );

        fireEvent.press(getByTestId('locate-button'));
        expect(mockOnCurrentLocation).toHaveBeenCalled();
    });

    it('should call onZoomIn when zoom in button is pressed', () => {
        const { getByTestId } = render(
            <MapController
                onCurrentLocation={mockOnCurrentLocation}
                onZoomIn={mockOnZoomIn}
                onZoomOut={mockOnZoomOut}
            />
        );

        fireEvent.press(getByTestId('zoom-in-button'));
        expect(mockOnZoomIn).toHaveBeenCalled();
    });

    it('should call onZoomOut when zoom out button is pressed', () => {
        const { getByTestId } = render(
            <MapController
                onCurrentLocation={mockOnCurrentLocation}
                onZoomIn={mockOnZoomIn}
                onZoomOut={mockOnZoomOut}
            />
        );

        fireEvent.press(getByTestId('zoom-out-button'));
        expect(mockOnZoomOut).toHaveBeenCalled();
    });
});