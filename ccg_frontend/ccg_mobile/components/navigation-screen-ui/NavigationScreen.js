import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import NavigationInfo from './sections/NavigationInfo';
import NavigationMap from './sections/NavigationMap';
import {getDirections, getDirectionProfiles, getShuttleStops} from '../../api/dataService';
import busLocationService from "../../services/BusLocationService";
import BusNavigationInfo from "./sections/BusNavigationInfo";
import NavigationHeader from "./sections/NavigationHeader";

const NavigationScreen = ({ navigation, route }) => {

    const params = route.params || {};


    const [startPoint, setStartPoint] = useState(params.start || {});
    const [destinationPoint, setDestinationPoint] = useState(params.destination || {});
    const [directionProfiles, setDirectionProfiles] = useState({});
    const [shuttleStops, setShuttleStops] = useState({});

    const [direction, setDirection] = useState(null);
    const [shuttleLocations, setShuttleLocations] = useState([]);

    const [selectedMode, setSelectedMode] = useState("foot-walking");


    const onSelectedMode = (mode) => {
        setSelectedMode(mode);
        
        // setDirection(directionProfiles)
        // console.log(direction.bbox)
        //console.log(JSON.stringify(direction.profile, null, 2))
    };

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
                .filter(profile => profile !== "foot-walking")
                .map(async profile => {
                    directions[profile] = await getDirections(
                        profile,
                        profile === "concordia-shuttle" ? [shuttleStops[0].longitude, shuttleStops[0].latitude] : [startPoint.location.longitude, startPoint.location.latitude],
                        profile === "concordia-shuttle" ? [shuttleStops[1].longitude, shuttleStops[1].latitude] : [destinationPoint.location.longitude, destinationPoint.location.latitude]
                        );
                });

            // Wait for all async fetches to complete
            await Promise.all(promises);
        
            console.log(directions);
            setDirectionProfiles(directions);
        } catch (error) {
            setDirection([]);
            console.error("Error fetching direction data: ", error);
        }
        

    };

    useEffect(() => {
        async function fetchShuttleStops() {
            try {
                const shuttle = await getShuttleStops();
                setShuttleStops(shuttle?.stops);
            } catch (error) {
                console.error("Error fetching shuttle stops :", error);
            }
        }

        fetchShuttleStops();
    }, []);

    useEffect(() => {
        if (startPoint && destinationPoint && shuttleStops.length > 0) {
            fetchDirections();
        }
    }, [startPoint, destinationPoint, shuttleStops]);

    useEffect(() => {
        if (selectedMode === "concordia-shuttle") {
            busLocationService.startTracking(500);
            const interval = setInterval(() => {
                setShuttleLocations(busLocationService.getBusLocations());
            }, 500);
            return () => {
                busLocationService.stopTracking();
                clearInterval(interval);
            };
        }
        setDirection(directionProfiles[selectedMode])
//        console.log(direction)
    }, [selectedMode])

    return (
        <View style={styles.container}>

            <NavigationHeader
                startAddress={
                    selectedMode === "concordia-shuttle"
                        ? "SGW Shuttle Stop"
                        : startPoint?.civic_address
                }
                destinationAddress={
                    selectedMode === "concordia-shuttle"
                        ? "LOY Shuttle Stop"
                        : destinationPoint?.civic_address
                }
                onSelectedMode={onSelectedMode}
                onBackPress={() => navigation.goBack()}
                selectedMode={selectedMode}
            />

            {/* Map Container (Center) */}
            <View style={styles.mapContainer}>
                {direction != null && <NavigationMap start={startPoint} destination={destinationPoint} pathCoordinates={direction.steps} bbox={direction.bbox} displayShuttle={selectedMode === "concordia-shuttle"} shuttleLocations={shuttleLocations} shuttleStops={shuttleStops}/>}
            </View>

            {/* Footer Section (NavigationInfo) */}
            {direction && selectedMode === "concordia-shuttle" ? (
                            <BusNavigationInfo
                                totalDistance={direction.total_distance}
                                totalDuration={direction.total_duration}
                            />
                        ) : direction ? (
                            <NavigationInfo
                                totalDistance={direction.total_distance}
                                totalDuration={direction.total_duration}
                                onStartNavigation={() => {}}
                            />
                        ) : null}

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