// hooks/useRouteInstruction.js
import { useState, useEffect } from 'react';

import { getCumulativeDistanceToNearestCoord, getCurrentStepData, flattenRouteCoordinates } from '../utils/outdoorRouteUtils';

/**
 * Custom hook that accepts dynamic route data and the user location,
 * then returns the current navigation step (instruction and remaining distance).
 *
 * @param {Object} routeData - A GeoJSON object representing the route.
 * @param {[number, number]} userLocation - The user's current location as [lng, lat].
 * @returns {Object} { instruction: string, distance: number }
 */
export function useRouteInstruction(routeData, userLocation) {
    const [stepData, setStepData] = useState({ instruction: "Fetching instruction...", distance: 0 });

    useEffect(() => {
        if (userLocation && routeData && routeData.steps && routeData.steps.length > 0) {
            const flattenedCoords = flattenRouteCoordinates(routeData);
            const currentDistance = getCumulativeDistanceToNearestCoord(flattenedCoords, userLocation);
            const data = getCurrentStepData(routeData, currentDistance);
            setStepData(data);
        }
    }, [userLocation, routeData]);

    return stepData;
}
