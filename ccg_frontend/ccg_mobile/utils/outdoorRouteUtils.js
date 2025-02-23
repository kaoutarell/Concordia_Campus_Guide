

/**
 * Calculates the distance (in meters) between two coordinates using the Haversine formula.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // radius of the Earth in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Returns the cumulative distance along the route up to the coordinate
 * that is closest to the user's current location.
 */
export const getCumulativeDistances = (coords) => {

    const cumulative = [0];
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
        const d = calculateDistance(
            coords[i - 1][1],
            coords[i - 1][0],
            coords[i][1],
            coords[i][0]
        );
        total += d;
        cumulative.push(total);
    }
    return cumulative;

}

/**
 * Finds the cumulative distance along the route corresponding to the user's current location.
 *
 * @param {Array} coords - Flattened array of coordinates.
 * @param {[number, number]} userLocation - User location in [lng, lat] format.
 * @returns {number} The cumulative distance (in meters) up to the nearest coordinate.
 */
export const getCumulativeDistanceToNearestCoord = (coords, userLocation) => {
    const cumulativeDistances = getCumulativeDistances(coords);
    let minIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < coords.length; i++) {
        const d = calculateDistance(
            coords[i][1],
            coords[i][0],
            userLocation[1],
            userLocation[0]
        );
        if (d < minDistance) {
            minDistance = d;
            minIndex = i;
        }
    }
    return cumulativeDistances[minIndex];
}

/**
 * Returns an object with the current instruction and the remaining distance (in meters)
 * for the current step based on the cumulative distance traveled.
 */
export const getCurrentStepData = (routeData, currentDistance) => {
    let accumulatedDistance = 0;
    const steps = routeData.steps;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        accumulatedDistance += step.distance;
        if (currentDistance <= accumulatedDistance) {
            const distanceIntoStep = currentDistance - (accumulatedDistance - step.distance);
            const distanceRemaining = step.distance - distanceIntoStep;
            return { instruction: step.instruction, distance: distanceRemaining };
        }
    }

    return { instruction: "Arrived at your destination", distance: 0 };
}

/**
 * Flattens the route's steps into a single array of coordinates.
 *
 * @param {Object} routeData - The route data object with a "steps" array.
 * @returns {Array} Flattened array of coordinates.
 */
export const flattenRouteCoordinates = (routeData) => {
    let allCoords = [];
    routeData.steps.forEach((step) => {
        allCoords = allCoords.concat(step.coordinates);
    });
    return allCoords;
}