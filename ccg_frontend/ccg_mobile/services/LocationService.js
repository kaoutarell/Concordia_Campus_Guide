// services/LocationService.js
import * as Location from 'expo-location';

class LocationService {
  static instance = null;
  currentLocation = null;
  locationListener = null;
  locationPermissionAccess = false;
  // New: an array of subscribers to be notified on location updates
  subscribers = [];

  constructor() {
    if (!LocationService.instance) {
      LocationService.instance = this;
    }
    return LocationService.instance;
  }

  // Allows components to subscribe to location changes.
  subscribe(callback) {
    this.subscribers.push(callback);
    // Optionally, immediately notify the new subscriber with the current location.
    if (this.currentLocation) {
      callback(this.currentLocation);
    }
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }

  // Request permission and start tracking location
  async startTrackingLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.locationPermissionAccess = false;
      this.currentLocation = null;
      console.log("LocationService: Permission to access location was denied");
      throw new Error('Permission to access location was denied');
    }
    this.locationPermissionAccess = true;

    this.locationListener = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        this.currentLocation = location;
        // Notify all subscribers with the new location
        this.subscribers.forEach((cb) => cb(location));
      }
    );
  }

  getCurrentLocation() {
    return this.currentLocation;
  }

  isLocationPermissionAllowed() {
    return this.locationPermissionAccess;
  }

  async stopTrackingLocation() {
    if (this.locationListener) {
      await this.locationListener.remove();
      this.locationListener = null;
    }
  }
}

const locationService = new LocationService();
export default locationService;
export { LocationService };
