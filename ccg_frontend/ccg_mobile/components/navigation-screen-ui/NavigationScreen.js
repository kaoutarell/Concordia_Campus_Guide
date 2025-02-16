import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import NavigationInfo from './sections/NavigationInfo';
import NavigationMap from './sections/NavigationMap';
import { getDirections, getDirectionProfiles } from '../../api/dataService';

import NavigationHeader from "./sections/NavigationHeader";

const NavigationScreen = ({ navigation, route }) => {

    const params = route.params || {};


    const [startPoint, setStartPoint] = useState(params.start || {});
    const [destinationPoint, setDestinationPoint] = useState(params.destination || {});
    const [directionProfiles, setDirectionProfiles] = useState({});

    const [direction, setDirection] = useState(null);

    const [selectedMode, setSelectedMode] = useState("foot-walking");


    const onSelectedMode = (mode) => {
        setSelectedMode(mode);
        setDirection(directionProfiles)
    };

    const fetchDirections = async () => {


        try {
            const data = await getDirectionProfiles();
            const profiles = data.profiles
            const directions = {}
            for (let i = 0; i < profiles.length; i++){
                directions[profiles[i]] = await getDirections(profiles[i], [startPoint.location.longitude, startPoint.location.latitude], [destinationPoint.location.longitude, destinationPoint.location.latitude]);
//                console.log("Fetched successfully directions for "+profiles[i])
            }
            console.log(directions)
            setDirectionProfiles(directions);
        } catch (error) {
            setDirection([]);
            console.error("Error fetching direction data: ", error);
        }

    };

    useEffect(() => {
        fetchDirections();
    }, [startPoint, destinationPoint]);

    useEffect(() => {
        setDirection(directionProfiles[selectedMode])
//        console.log(direction)
    }, [selectedMode])

    return (
        <View style={styles.container}>

            <NavigationHeader
                startAddress={startPoint.civic_address}
                destinationAddress={destinationPoint.civic_address}
                onSelectedMode={onSelectedMode}
                onBackPress={() => navigation.goBack()}
                selectedMode={selectedMode}
            />

            {/* Map Container (Center) */}
            <View style={styles.mapContainer}>
                {direction != null && <NavigationMap start={startPoint} destination={destinationPoint} pathCoordinates={direction.steps} />}
            </View>

            {/* Footer Section (NavigationInfo) */}
            {direction != null && <NavigationInfo totalDistance={direction?.total_distance} totalDuration={direction?.total_duration} />}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    mapContainer: {
        height: '60%', // Ajustez la hauteur de la carte selon vos besoins
        width: '100%',
    },
    map: {
        flex: 1,
        width: '100%',
    },
});

export default NavigationScreen;