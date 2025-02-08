import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Button } from 'react-native';
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

    // TODO: Implement the navigation logic. API call to backend for directions

    return (
        <View style={styles.container}>
            <NavigationInfo startAddress={startPoint.civic_address} destinationAddress={destinationPoint.civic_address} 
            onBackPress={() => navigation.goBack()}
            />
            {/*<MapView style={styles.map} />*/}
            {direction!=null && <NavigationMap start={startPoint} destination={destinationPoint} pathCoordinates={direction.steps}/>}
            <NavigationModes />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    map: {
        flex: 1,
        marginBottom: 16,
    },
    navigationModes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default NavigationScreen;