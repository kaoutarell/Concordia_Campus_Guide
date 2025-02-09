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

    const dumyData={
        "total_distance": 6406.1,
        "total_duration": 4612.2,
        "steps": [
          {
            "distance": 43.1,
            "duration": 31.0,
            "instruction": "Head southwest on Rue Sainte-Catherine Ouest",
            "type": 11,
            "coordinates": [
              [
                -73.57815,
                45.494763
              ],
              [
                -73.578499,
                45.494463
              ]
            ]
          },
          {
            "distance": 9.7,
            "duration": 7.0,
            "instruction": "Turn right",
            "type": 1,
            "coordinates": [
              [
                -73.578499,
                45.494463
              ],
              [
                -73.578597,
                45.494517
              ]
            ]
          },
          {
            "distance": 10.1,
            "duration": 7.3,
            "instruction": "Turn left",
            "type": 0,
            "coordinates": [
              [
                -73.578597,
                45.494517
              ],
              [
                -73.578641,
                45.494483
              ],
              [
                -73.578683,
                45.49445
              ]
            ]
          }
        ]
    }

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
            <NavigationInfo />
            
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