import * as Location from 'expo-location';

class LocationService {
  static instance = null;
  currentLocation = null;
  locationListener = null;
  locationPermissionAccess = false;

  constructor() {
    if (!LocationService.instance) {
      LocationService.instance = this;
    }
    return LocationService.instance;
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

// Export as a singleton
const locationService = new LocationService();

export default locationService;
