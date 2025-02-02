// LocationService.js
import * as Location from 'expo-location';

class LocationService {
  static instance = null;
  currentLocation = null;
  locationListener = null;
  locationPermissionAccess = false;

  constructor() {
    if (LocationService.instance) {
      return LocationService.instance;
    }
    LocationService.instance = this;
  }
  
  // Request permission and start tracking location
  async startTrackingLocation() {
    // Request permission for location access
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      locationPermissionAccess = false
      this.currentLocation = null
      console.log("LocationService: Permission to access location was denied")
      throw new Error('Permission to access location was denied');
    }
    locationPermissionAccess = true
    // Start tracking location
    this.locationListener = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation, // Track with high accuracy
        timeInterval: 1000, // Update every 1 second
        distanceInterval: 1, // Update when the device moves by 1 meter
      },
      (location) => {
        this.currentLocation = location;
        //console.log('Updated Location:', location); // For debugging
      }
    );
  }

  // Get the current location
  // Output Format:
  // {
  //   "coords": {
  //         "accuracy",
  //         "altitude",
  //         "altitudeAccuracy",
  //         "heading",
  //         "latitude",
  //         "longitude",
  //         "speed"
  //   },
  //   "mocked",
  //   "timestamp"
  // }
  getCurrentLocation() {
    return this.currentLocation;
  }

  // Check if location was granted/denied
  isLocationPermissionAllowed(){
    return this.locationPermissionAccess;
  }


  // Stop tracking location
  async stopTrackingLocation() {
    if (this.locationListener) {
      await this.locationListener.remove();
      this.locationListener = null;
    }
  }
}

const locationService = new LocationService();
export default locationService;