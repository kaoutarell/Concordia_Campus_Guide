import React, { useEffect, useState } from 'react';
import { getBuildings } from '../api/dataService';

import MapViewComponent from '../components/MapViewComponent';
import NavigationToggle from '../components/NavigationToggle';

import { View, StyleSheet } from "react-native";


import HeaderBar from '../components/HeaderBar';

const MapScreen = () => {

    const [locations, setLocations] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState(null);
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

    const onCampusSelect = (campus) => {
        setSelectedCampus(campus);
    };

    // Initial region for Concordia SGW Campus
    const initialRegion = {
        latitude: 45.495654,
        longitude: -73.579219,
        latitudeDelta: 0.010,
        longitudeDelta: 0.010,
    };

    return (


        <View style={styles.container}>

            <HeaderBar selectedCampus={selectedCampus} onCampusSelect={onCampusSelect} searchText={searchText} setSearchText={setSearchText} />

            {/* Map */}
            <MapViewComponent locations={locations} initialRegion={initialRegion} />

            <NavigationToggle isIndoor={isIndoor} setIsIndoor={setIsIndoor} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    menuButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
    menuText: { fontSize: 30 },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 50 },
    campusSelector: { backgroundColor: "#8B1D3B", padding: 10, borderRadius: 10, alignSelf: "center", marginTop: 10 },
    campusText: { color: "white", fontWeight: "bold" },
    map: { flex: 1 },
    switchContainer: { flexDirection: "row", justifyContent: "space-around", padding: 10 },
    switchButton: { padding: 10, backgroundColor: "#eee", borderRadius: 10 },
});

export default MapScreen;


