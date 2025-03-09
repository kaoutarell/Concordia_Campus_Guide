import locationService from "../services/LocationService";

export const getMyCurrentLocation = async () => {
  try {
    await locationService.startTrackingLocation();
    const currentLocation = locationService.getCurrentLocation();

    if (!currentLocation?.coords) {
      return getDefaultDestination();
    }

    return {
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      civic_address: "Current Location",
    };
  } catch (error) {
    // Return a fallback location if unable to get current location
    return getDefaultDestination();
  }
};

export const getDefaultDestination = () => {
  return {
    location: {
      latitude: 45.4972159,
      longitude: -73.5794777,
    },
    civic_address: "Concordia University",
  };
};
