import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getBuildings } from '../api/dataService';
import HeaderBar from '../components/HeaderBar';
import MapViewComponent from '../components/MapViewComponent';
import NavigationToggle from '../components/NavigationToggle';

const MapScreen = () => {

    const [locations, setLocations] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState("SGW");
    const [searchText, setSearchText] = useState("");
    const [isIndoor, setIsIndoor] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getBuildings();
                setLocations(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLocations();
    }, []);

    // Initial region for Concordia SGW Campus
    const initialRegion = {
        latitude: 45.50169,
        longitude: -73.567256,
        latitudeDelta: 0.010,
        longitudeDelta: 0.010,
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderBar
                searchText={searchText}
                setSearchText={setSearchText}
                selectedCampus={selectedCampus}
                setSelectedCampus={setSelectedCampus}
            />

            {/* Map */}
            <MapViewComponent locations={locations} initialRegion={initialRegion} />

            {/* Indoor/Outdoor Navigation Toggle */}
            <NavigationToggle isIndoor={isIndoor} setIsIndoor={setIsIndoor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MapScreen;
