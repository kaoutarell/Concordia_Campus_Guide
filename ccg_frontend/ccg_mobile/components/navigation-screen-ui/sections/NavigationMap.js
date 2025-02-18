import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";
import Bus_Marker from "../../../assets/bus-marker.png";


const NavigationMap = ({ start, destination, bbox, pathCoordinates, shuttleLocations, shuttleStops, displayShuttle = false }) => {
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
                            coordinate={ displayShuttle ?
                                {
                                    latitude: shuttleStops[0].latitude,
                                    longitude: shuttleStops[0].longitude,
                                }
                                :
                                {
                                    latitude: start.location.latitude,
                                    longitude: start.location.longitude,
                                }
                        }
                            title={displayShuttle ? 'SGW' : start.building_code}
                            pinColor="red"
                        />
                        <Marker
                            coordinate={ displayShuttle ?
                                {
                                    latitude: shuttleStops[1].latitude,
                                    longitude: shuttleStops[1].longitude,
                                }
                                :
                                {
                                    latitude: destination.location.latitude,
                                    longitude: destination.location.longitude,
                                }
                            }
                            title={displayShuttle ? 'LOY' : destination.building_code}
                            pinColor="red"
                        />
            <Polyline
                coordinates={coordinates?.length > 0 ? coordinates : []}
                strokeColor="navy"
                strokeWidth={3}
            />
            {shuttleLocations && displayShuttle &&
                            shuttleLocations.map((bus) => (
                                <Marker
                                    key={bus.id}
                                    coordinate={{
                                        latitude: bus.latitude,
                                        longitude: bus.longitude,
                                    }}
                                    title={`Shuttle ${bus.id}`}
                                    pinColor="red"
                                    image={Bus_Marker}
                                />
                            ))}
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