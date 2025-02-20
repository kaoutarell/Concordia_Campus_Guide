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
    // const [onModifyAddress, setOnModifyAddress] = useState({
    //     direction: "",
    //     address:""
    // })

    const [direction, setDirection] = useState(null);

    const [selectedMode, setSelectedMode] = useState("foot-walking");


    const onSelectedMode = (mode) => {
        setSelectedMode(mode);
    };

    const onModifyAddress = (type, location) => {
        if (type === "destination"){
            setDestinationPoint(location)
        }
        else {
            setStartPoint(location)
        }
    }

    const fetchDirections = async () => {

        try {
            const data = await getDirectionProfiles();
            const profiles = data.profiles;
            const directions = {};
        
            // Fetch first profile synchronously
            if (profiles.includes("foot-walking")) {
                directions["foot-walking"] = await getDirections(
                    "foot-walking",
                    [startPoint.location.longitude, startPoint.location.latitude],
                    [destinationPoint.location.longitude, destinationPoint.location.latitude]
                );
                setDirection(directions["foot-walking"]);
            }
        
            // Fetch other profiles asynchronously
            const promises = profiles
                .filter(profile => profile !== "foot-walking") // Exclude the first one
                .map(async profile => {
                    directions[profile] = await getDirections(
                        profile,
                        [startPoint.location.longitude, startPoint.location.latitude],
                        [destinationPoint.location.longitude, destinationPoint.location.latitude]
                    );
                });
        
            // Wait for all async fetches to complete
            await Promise.all(promises);
        
            //console.log(directions);
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
                onModifyAddress={onModifyAddress}
                onBackPress={() => navigation.goBack()}
                selectedMode={selectedMode}
            />

            {/* Map Container (Center) */}
            <View style={styles.mapContainer}>
                {direction != null && <NavigationMap start={startPoint} destination={destinationPoint} pathCoordinates={direction.steps} bbox={direction?.bbox} />}
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