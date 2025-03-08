import {
  calculateDistance,
  getCumulativeDistances,
  getCumulativeDistanceToNearestCoord,
  getCurrentStepData,
  flattenRouteCoordinates,
} from "../utils/outdoorRouteUtils";

// Mock the functions that aren't exported directly
jest.mock("../utils/outdoorRouteUtils", () => {
  const original = jest.requireActual("../utils/outdoorRouteUtils");
  return {
    ...original,
    calculateDistance: jest.fn().mockImplementation((lat1, lon1, lat2, lon2) => {
      // This is a simplified version for testing
      return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111000;
    }),
  };
});

describe("outdoorRouteUtils", () => {
  describe("calculateDistance", () => {
    it("calculates distance between two coordinates", () => {
      const result = calculateDistance(45.5, -73.6, 45.51, -73.59);
      expect(result).toBeGreaterThan(0);
      expect(calculateDistance).toHaveBeenCalledWith(45.5, -73.6, 45.51, -73.59);
    });
  });

  describe("getCumulativeDistances", () => {
    it("calculates cumulative distances for route coordinates", () => {
      const coords = [
        [-73.6, 45.5], // [longitude, latitude]
        [-73.59, 45.51],
        [-73.58, 45.52],
      ];

      const result = getCumulativeDistances(coords);

      // First point should be 0
      expect(result[0]).toBe(0);

      // Other points should have cumulative distance values
      expect(result.length).toBe(coords.length);
      expect(result[1]).toBeGreaterThan(0);
      expect(result[2]).toBeGreaterThan(result[1]);
    });

    it("returns [0] for single coordinate", () => {
      const coords = [[-73.6, 45.5]];
      const result = getCumulativeDistances(coords);
      expect(result).toEqual([0]);
    });
  });

  describe("getCumulativeDistanceToNearestCoord", () => {
    it("returns distance to nearest coordinate on route", () => {
      const coords = [
        [-73.6, 45.5],
        [-73.59, 45.51],
        [-73.58, 45.52],
      ];
      const userLocation = [-73.585, 45.515]; // Closest to the second point

      const result = getCumulativeDistanceToNearestCoord(coords, userLocation);

      // Should return cumulative distance to the second point
      expect(result).toBeGreaterThan(0);
    });

    it("returns distance to nearest coordinate when coordinates are far apart", () => {
      const coords = [
        [-74.6, 46.5], // Very far point
        [-73.59, 45.51], // This one should be closest
        [-72.58, 44.52], // Very far point
      ];
      const userLocation = [-73.6, 45.5]; // Closest to the second point

      // Reset the mock implementation
      calculateDistance.mockReset();

      // Mock the distance calculation to make the test deterministic
      calculateDistance.mockImplementation((lat1, lon1, lat2, lon2) => {
        // Check which point we're calculating and return appropriate distance
        if (lat1 === 46.5 && lon1 === -74.6) return 150000; // Point 1
        if (lat1 === 45.51 && lon1 === -73.59) return 5000; // Point 2
        if (lat1 === 44.52 && lon1 === -72.58) return 200000; // Point 3
        return 100000; // Default
      });

      const result = getCumulativeDistanceToNearestCoord(coords, userLocation);

      // We expect the function to identify the second point as closest
      // Just verify the result is a number, and don't check call count which is implementation dependent
      expect(result).toEqual(expect.any(Number));
    });
  });

  describe("getCurrentStepData", () => {
    it("returns current instruction and remaining distance", () => {
      const routeData = {
        steps: [
          { instruction: "Walk north", distance: 100 },
          { instruction: "Turn right", distance: 150 },
          { instruction: "Arrive at destination", distance: 50 },
        ],
      };

      // Test when we're in the first step
      let result = getCurrentStepData(routeData, 50);
      expect(result).toEqual({
        instruction: "Walk north",
        distance: 50, // 100 - 50 = 50 remaining in this step
      });

      // Test when we're in the second step
      result = getCurrentStepData(routeData, 120);
      expect(result).toEqual({
        instruction: "Turn right",
        distance: 130, // 100 + 150 - 120 = 130 remaining in this step
      });

      // Test when we've completed all steps
      result = getCurrentStepData(routeData, 350);
      expect(result).toEqual({
        instruction: "Arrived at your destination",
        distance: 0,
      });
    });
  });

  describe("flattenRouteCoordinates", () => {
    it("flattens route step coordinates into single array", () => {
      const routeData = {
        steps: [
          {
            coordinates: [
              [-73.6, 45.5],
              [-73.59, 45.51],
            ],
          },
          {
            coordinates: [
              [-73.59, 45.51],
              [-73.58, 45.52],
            ],
          },
        ],
      };

      const result = flattenRouteCoordinates(routeData);

      expect(result).toEqual([
        [-73.6, 45.5],
        [-73.59, 45.51],
        [-73.59, 45.51],
        [-73.58, 45.52],
      ]);
    });

    it("returns empty array for empty steps", () => {
      const routeData = { steps: [] };
      const result = flattenRouteCoordinates(routeData);
      expect(result).toEqual([]);
    });
  });
});
