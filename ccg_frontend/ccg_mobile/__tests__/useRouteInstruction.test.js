import { renderHook } from '@testing-library/react-hooks';
import { useRouteInstruction } from "../hooks/useRouteInstruction";
import * as outdoorRouteUtils from "../utils/outdoorRouteUtils";

// Mock the outdoorRouteUtils functions
jest.mock("../utils/outdoorRouteUtils");

describe("useRouteInstruction", () => {
  const mockRouteData = {
    steps: [
      {
        instruction: "Go straight for 100 meters",
        distance: 100,
      },
      {
        instruction: "Turn right and walk for 200 meters",
        distance: 200,
      },
    ],
  };

  const mockUserLocation = [-73.578, 45.495];
  const mockFlattenedCoords = [[-73.579, 45.497], [-73.578, 45.496], [-73.577, 45.495]];
  const mockCurrentDistance = 150;
  const mockStepData = { instruction: "Turn right and walk for 200 meters", distance: 50 };
  const mockArrivalData = { instruction: "You have arrived at your destination", distance: 0 };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the util functions
    outdoorRouteUtils.flattenRouteCoordinates = jest.fn().mockReturnValue(mockFlattenedCoords);
    outdoorRouteUtils.getCumulativeDistanceToNearestCoord = jest.fn().mockReturnValue(mockCurrentDistance);
    outdoorRouteUtils.getCurrentStepData = jest.fn().mockReturnValue(mockStepData);
  });

  it("should initialize with default instruction and distance", () => {
    const { result } = renderHook(() => useRouteInstruction(null, null));
    expect(result.current).toEqual({ instruction: "Fetching instruction...", distance: 0 });
  });
  
  it("should not process route data when route data is missing", () => {
    renderHook(() => useRouteInstruction(null, mockUserLocation));
    
    // Verify mocks were not called
    expect(outdoorRouteUtils.flattenRouteCoordinates).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCurrentStepData).not.toHaveBeenCalled();
  });
  
  it("should not process route data when user location is missing", () => {
    renderHook(() => useRouteInstruction(mockRouteData, null));
    
    // Verify mocks were not called
    expect(outdoorRouteUtils.flattenRouteCoordinates).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCurrentStepData).not.toHaveBeenCalled();
  });
  
  it("should not process route data when steps array is empty", () => {
    const emptyRouteData = { steps: [] };
    renderHook(() => useRouteInstruction(emptyRouteData, mockUserLocation));
    
    // Verify mocks were not called
    expect(outdoorRouteUtils.flattenRouteCoordinates).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).not.toHaveBeenCalled();
    expect(outdoorRouteUtils.getCurrentStepData).not.toHaveBeenCalled();
  });
  
  it("should process route data when all inputs are valid", () => {
    renderHook(() => useRouteInstruction(mockRouteData, mockUserLocation));
    
    // Verify that utils were called with correct args
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenCalledWith(mockRouteData);
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).toHaveBeenCalledWith(
      mockFlattenedCoords, 
      mockUserLocation
    );
    expect(outdoorRouteUtils.getCurrentStepData).toHaveBeenCalledWith(
      mockRouteData, 
      mockCurrentDistance
    );
  });

  it("should update stepData state with correct values when inputs are valid", () => {
    const { result } = renderHook(() => useRouteInstruction(mockRouteData, mockUserLocation));
    
    // Verify that the hook returns the correct step data
    expect(result.current).toEqual(mockStepData);
  });

  it("should recalculate when userLocation changes", () => {
    const { result, rerender } = renderHook(
      (props) => useRouteInstruction(props.routeData, props.userLocation), 
      { initialProps: { routeData: mockRouteData, userLocation: mockUserLocation } }
    );
    
    // First call assertions
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenCalledTimes(1);
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).toHaveBeenCalledTimes(1);
    expect(outdoorRouteUtils.getCurrentStepData).toHaveBeenCalledTimes(1);
    
    // Change user location
    const newUserLocation = [-73.580, 45.498];
    rerender({ routeData: mockRouteData, userLocation: newUserLocation });
    
    // Verify the functions were called again with the new location
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenCalledTimes(2);
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).toHaveBeenCalledTimes(2);
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).toHaveBeenLastCalledWith(
      mockFlattenedCoords, 
      newUserLocation
    );
    expect(outdoorRouteUtils.getCurrentStepData).toHaveBeenCalledTimes(2);
  });

  it("should recalculate when routeData changes", () => {
    const { result, rerender } = renderHook(
      (props) => useRouteInstruction(props.routeData, props.userLocation), 
      { initialProps: { routeData: mockRouteData, userLocation: mockUserLocation } }
    );
    
    // First call assertions
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenCalledTimes(1);
    
    // Change route data
    const newRouteData = {
      steps: [
        {
          instruction: "New instruction",
          distance: 300,
        }
      ]
    };
    rerender({ routeData: newRouteData, userLocation: mockUserLocation });
    
    // Verify the functions were called again with new route data
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenCalledTimes(2);
    expect(outdoorRouteUtils.flattenRouteCoordinates).toHaveBeenLastCalledWith(newRouteData);
  });

  it("should show arrival message when user reaches destination", () => {
    // Set up getCurrentStepData to return arrival data
    outdoorRouteUtils.getCurrentStepData.mockReturnValueOnce(mockArrivalData);
    
    const { result } = renderHook(() => useRouteInstruction(mockRouteData, mockUserLocation));
    
    // Verify that the hook returns the arrival message
    expect(result.current).toEqual(mockArrivalData);
  });

  it("should handle steps with missing coordinate data", () => {
    // Mock flattenRouteCoordinates to return empty array (no coordinates)
    outdoorRouteUtils.flattenRouteCoordinates.mockReturnValueOnce([]);
    
    const incompleteRouteData = {
      steps: [
        {
          instruction: "Go straight",
          distance: 100,
          // missing coordinates
        }
      ]
    };
    
    renderHook(() => useRouteInstruction(incompleteRouteData, mockUserLocation));
    
    // Verify getCumulativeDistanceToNearestCoord was called with empty coords
    expect(outdoorRouteUtils.getCumulativeDistanceToNearestCoord).toHaveBeenCalledWith(
      [], 
      mockUserLocation
    );
  });
});
