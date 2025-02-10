import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Button, Platform, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import NavigationModes from '../components/navigation/NavigationModes';
import NavigationInfo from '../components/navigation/NavigationInfo';
import NavigationMap from '../components/navigation/NavigationMap';
import { getDirections } from '../api/dataService';

const NavigationScreen = ({ navigation, route }) => {
    const startPoint = route.params.start;
    const destinationPoint = route.params.destination;
    const [direction, setDirection] = useState(null);
    const fetchDirections = async()=>{
      try{
        const data = await getDirections("foot-walking", [startPoint.location.longitude, startPoint.location.latitude], [destinationPoint.location.longitude, destinationPoint.location.latitude]);
        setDirection(data);
      }catch (error){
        console.error("Error fetching direction data: ", error);
      }
    };

    useEffect(()=>{
      fetchDirections();
    }, [startPoint, destinationPoint]);

    return (
        <View style={styles.container}>
            {/* Header Section (NavigationModes) */}
            <NavigationModes 
                startAddress={startPoint.civic_address} 
                destinationAddress={destinationPoint.civic_address}
                 
                onBackPress={() => navigation.goBack()}
            />

            {/* Map Container (Center) */}
            <View style={styles.mapContainer}>
            {direction!=null && <NavigationMap start={startPoint} destination={destinationPoint} pathCoordinates={direction.steps}/>}
                </View>

            {/* Footer Section (NavigationInfo) */}
            {direction!=null && <NavigationInfo totalDistance={direction.total_distance} totalDuration={direction.total_duration}/>}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Gérer le padding pour Android
    },
    mapContainer: {
        height: '58%', // Ajustez la hauteur de la carte selon vos besoins
        width: '100%',
    },
    map: {
        flex: 1, 
        width: '100%',
    },
});

export default NavigationScreen;