import locationService from "../services/LocationService";

export const getMyCurrentLocation = async () => {

    locationService.startTrackingLocation();
    const currentLocation = locationService.getCurrentLocation();

    return {
        location: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
        }, civic_address: "Current Location"
    }

}

export const getDefaultDestination = () => {
    return {
        location: {
            latitude: 45.4972159,
            longitude: -73.5794777
        }, civic_address: "Concordia University"
    }

}
