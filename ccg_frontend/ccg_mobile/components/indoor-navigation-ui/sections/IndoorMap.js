import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons"; // Import Ionicons
import { getFloorImage } from "../../../utils/floorImages.js";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
import { getBuildings, getPointOfInterests } from "../../../api/dataService.js";
import { useNavigation } from "@react-navigation/native";

const IndoorMap = ({ path, index }) => {
  const pinSize = 90;
  const navigation = useNavigation();

  const [image, setImage] = useState(getFloorImage("H8"));

  useEffect(() => {
    if (path == null) {
      setImage(getFloorImage("H8"));
    } else {
      setImage(getFloorImage(path["floor_sequence"][index]));
    }
  }, [index]);

  const goOutside = async () => {
    let buildings = await getBuildings();
    let poi = await getPointOfInterests();
    let startLocation = null;
    let destinationLocation = null;
    let startBuildingCode = path["floor_sequence"][0]
      .split("")
      .filter(char => isNaN(char))
      .join("");
    let destinationBuildingCode = path["floor_sequence"]
      .at(-1)
      .split("")
      .filter(char => isNaN(char))
      .join("");
    buildings.forEach(element => {
      if (element.building_code == startBuildingCode && element.building_code != "") {
        startLocation = element;
      }

      if (element.building_code == destinationBuildingCode && element.building_code != "") {
        destinationLocation = element;
      }
    });

    navigation.navigate("Navigation", {
      start: startLocation,
      destination: destinationLocation,
      allLocations: [
        ...buildings.map(item => ({ ...item, id: `school-${item.id}` })),
        ...poi.map(item => ({ ...item, id: `poi-${item.id}` })),
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Text>ReactNativeZoomableView</Text>
      <View style={{ borderWidth: 5, height: 350, width: "100%", alignItems: "center", overflow: "hidden" }}>
        {path != null && (
          <Text style={{ fontSize: 18, fontWeight: "bold" }} testID="title">
            Current Floor: {path["floor_sequence"][index]}
          </Text>
        )}
        {path == null && (
          <Text style={{ fontSize: 18 }} testID="default-title">
            {"H8"}
          </Text>
        )}
        {path?.floor_sequence[index] != "Outside" && (
          <ReactNativeZoomableView
            maxZoom={10}
            minZoom={0.3}
            zoomStep={0.5}
            bindToBorders={true}
            contentWidth={1024}
            contentHeight={1024}
            initialZoom={0.3}
          >
            <ImageBackground style={{ width: 1024, height: 1024, resizeMode: "contain" }} source={image}>
              <Svg style={styles.svg} testID="path-svg">
                {path !== null && (
                  <Path
                    d={path["path_data"][path["floor_sequence"][index]]}
                    fill="transparent"
                    stroke="black"
                    strokeWidth="5"
                  />
                )}
              </Svg>

              {/* Start Pin */}
              {/* The pin needs to be centered at the specified coordinates. 
            If we place the icon at exactly path["pin"][path["floor_sequence"][index]][0][0] and path["pin"][path["floor_sequence"][index]][0][1], 
            the top-left corner of the pin will be at that point */}
              {path !== null && path["pin"][path["floor_sequence"][index]] != null && (
                <Ionicons
                  testID="start-pin"
                  name="location-sharp"
                  size={pinSize}
                  color="black"
                  style={[
                    styles.pin,
                    {
                      left: path["pin"][path["floor_sequence"][index]][0][0] - pinSize / 2, // x-coord
                      top: path["pin"][path["floor_sequence"][index]][0][1] - pinSize, // y-coord
                    },
                  ]}
                />
              )}
              {/* now, to center the pin at the coordinates, 
            we adjust the position by subtracting half the pin size from the x-coord & subtracting 
            the full pin size from the y-coord */}
              {/* Destination Pin */}
              {path !== null && path["pin"][path["floor_sequence"][index]] != null && (
                <Ionicons
                  testID="destination-pin"
                  name="pin-outline"
                  size={pinSize}
                  color="black"
                  style={[
                    styles.pin,
                    {
                      left: path["pin"][path["floor_sequence"][index]][1][0] - pinSize / 2,
                      top: path["pin"][path["floor_sequence"][index]][1][1] - pinSize,
                    },
                  ]}
                />
              )}
            </ImageBackground>
          </ReactNativeZoomableView>
        )}
        {path?.floor_sequence[index] == "Outside" && (
          <TouchableOpacity style={styles.outside} onPress={goOutside} testID="outside-button">
            <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>Move to Outside Navigation</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

IndoorMap.propTypes = {
  path: PropTypes.shape({
    pin: PropTypes.object,
    path_data: PropTypes.object,
    floor_sequence: PropTypes.array,
  }),
  index: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "75%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  pin: {
    position: "absolute",
  },
  outside: {
    height: 250,
    width: 250,
    marginTop: 40,
    backgroundColor: "#800020",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30, // More rounded button
  },
  outsideContainer: {
    height: 1024,
    width: 1024,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IndoorMap;
