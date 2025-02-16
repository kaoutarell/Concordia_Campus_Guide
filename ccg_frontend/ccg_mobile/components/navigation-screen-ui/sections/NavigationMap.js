import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";

const NavigationMap = ({ start, destination, bbox, pathCoordinates }) => {
    let coordinates = [];
    pathCoordinates?.forEach(element => {
        element.coordinates.forEach(cord => {
            coordinates.push({
                latitude: cord[1],
                longitude: cord[0]
            })
        })
    });

   // console.log(coordinates)

    return (
        <MapView
            style={style.map}
            showsUserLocation={true}
            region={{
                latitude: (bbox[1] + bbox[3]) / 2,
                longitude: (bbox[0] + bbox[2]) / 2,
                latitudeDelta: Math.abs(bbox[3] - bbox[1]) * 1.2,  // Add some padding
                longitudeDelta: Math.abs(bbox[2] - bbox[0]) * 1.2, // Add some padding
            }}
            
        >
            <Marker
                coordinate={{
                    latitude: start.location?.latitude,
                    longitude: start?.location?.longitude,
                }}
                title={start?.building_code}
                pinColor="red"
            />
            <Marker
                coordinate={{
                    latitude: destination?.location?.latitude,
                    longitude: destination?.location?.longitude,
                }}
                title={destination?.building_code}
                pinColor="red"
            />
            <Polyline
                coordinates={coordinates?.length > 0 ? coordinates : []}
                strokeColor="navy"
                strokeWidth={3}
            />
        </MapView>
    )
}

const style = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
})

export default NavigationMap;