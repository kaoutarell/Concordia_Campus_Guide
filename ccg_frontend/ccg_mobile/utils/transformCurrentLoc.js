const transformLocation = (currentLocation) => {
    if (!currentLocation?.coords) {
        console.error("Invalid location object:", currentLocation);
        return null;
    }

    return {
        building_code: "CURR_LOC",
        civic_address: "Your Location",
        id: 1, // Placeholder ID
        location: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
        },
        name: "Current location",
    };
};

export default transformLocation;