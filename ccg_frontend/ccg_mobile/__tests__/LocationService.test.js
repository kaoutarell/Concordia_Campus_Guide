import locationService from '../services/LocationService';
import * as Location from 'expo-location';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: {
    BestForNavigation: 6
  }
}));

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset internal state of locationService for each test
    locationService.currentLocation = null;
    locationService.locationListener = null;
    locationService.locationPermissionAccess = false;
    locationService.subscribers = [];
  });

  describe('Singleton pattern', () => {
    it('should return the same instance when creating new objects', () => {
      const LocationServiceClass = require('../services/LocationService').LocationService;
      const instance1 = locationService;
      const instance2 = new LocationServiceClass();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('subscribe/unsubscribe', () => {
    it('should add callback to subscribers', () => {
      const callback = jest.fn();
      
      locationService.subscribe(callback);
      
      expect(locationService.subscribers).toContain(callback);
    });
    
    it('should call callback immediately if current location exists', () => {
      const callback = jest.fn();
      locationService.currentLocation = { coords: { latitude: 45.5, longitude: -73.6 } };
      
      locationService.subscribe(callback);
      
      expect(callback).toHaveBeenCalledWith(locationService.currentLocation);
    });
    
    it('should remove callback from subscribers', () => {
      const callback = jest.fn();
      locationService.subscribers = [callback];
      
      locationService.unsubscribe(callback);
      
      expect(locationService.subscribers).not.toContain(callback);
    });
    
    it('should not affect other subscribers when removing a callback', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      locationService.subscribers = [callback1, callback2];
      
      locationService.unsubscribe(callback1);
      
      expect(locationService.subscribers).toEqual([callback2]);
    });
  });

  describe('startTrackingLocation', () => {
    it('should request location permissions', async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      const mockListener = { remove: jest.fn() };
      Location.watchPositionAsync.mockResolvedValueOnce(mockListener);
      
      await locationService.startTrackingLocation();
      
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });
    
    it('should set locationPermissionAccess to true when permission is granted', async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      const mockListener = { remove: jest.fn() };
      Location.watchPositionAsync.mockResolvedValueOnce(mockListener);
      
      await locationService.startTrackingLocation();
      
      expect(locationService.locationPermissionAccess).toBe(true);
    });
    
    it('should throw error when permission is denied', async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      
      await expect(locationService.startTrackingLocation()).rejects.toThrow('Permission to access location was denied');
      expect(locationService.locationPermissionAccess).toBe(false);
      expect(locationService.currentLocation).toBeNull();
    });
    
    it('should start watching position when permission is granted', async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      const mockListener = { remove: jest.fn() };
      Location.watchPositionAsync.mockResolvedValueOnce(mockListener);
      
      await locationService.startTrackingLocation();
      
      expect(Location.watchPositionAsync).toHaveBeenCalledWith(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        expect.any(Function)
      );
      expect(locationService.locationListener).toBe(mockListener);
    });
    
    it('should update currentLocation and notify subscribers when location changes', async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      
      // Capture the watchPosition callback
      let watchPositionCallback;
      const mockListener = { remove: jest.fn() };
      Location.watchPositionAsync.mockImplementationOnce((options, callback) => {
        watchPositionCallback = callback;
        return Promise.resolve(mockListener);
      });
      
      // Add subscribers
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();
      locationService.subscribers = [subscriber1, subscriber2];
      
      await locationService.startTrackingLocation();
      
      // Simulate location update
      const mockLocation = { coords: { latitude: 45.5, longitude: -73.6 } };
      watchPositionCallback(mockLocation);
      
      expect(locationService.currentLocation).toBe(mockLocation);
      expect(subscriber1).toHaveBeenCalledWith(mockLocation);
      expect(subscriber2).toHaveBeenCalledWith(mockLocation);
    });
  });

  describe('getCurrentLocation', () => {
    it('should return current location', () => {
      const mockLocation = { coords: { latitude: 45.5, longitude: -73.6 } };
      locationService.currentLocation = mockLocation;
      
      const result = locationService.getCurrentLocation();
      
      expect(result).toBe(mockLocation);
    });
    
    it('should return null when no location is available', () => {
      locationService.currentLocation = null;
      
      const result = locationService.getCurrentLocation();
      
      expect(result).toBeNull();
    });
  });

  describe('isLocationPermissionAllowed', () => {
    it('should return true when permission is allowed', () => {
      locationService.locationPermissionAccess = true;
      
      const result = locationService.isLocationPermissionAllowed();
      
      expect(result).toBe(true);
    });
    
    it('should return false when permission is not allowed', () => {
      locationService.locationPermissionAccess = false;
      
      const result = locationService.isLocationPermissionAllowed();
      
      expect(result).toBe(false);
    });
  });

  describe('stopTrackingLocation', () => {
    it('should remove location listener when it exists', async () => {
      const mockListener = { remove: jest.fn() };
      locationService.locationListener = mockListener;
      
      await locationService.stopTrackingLocation();
      
      expect(mockListener.remove).toHaveBeenCalled();
      expect(locationService.locationListener).toBeNull();
    });
    
    it('should do nothing when no location listener exists', async () => {
      locationService.locationListener = null;
      
      await locationService.stopTrackingLocation();
      
      // Just ensure no errors are thrown
      expect(locationService.locationListener).toBeNull();
    });
  });
});