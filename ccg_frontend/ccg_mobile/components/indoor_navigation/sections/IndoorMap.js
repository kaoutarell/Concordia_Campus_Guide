import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ImageBackground } from "react-native";
import Hall8 from "../floors/Hall-8.png";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Svg, { Path } from "react-native-svg";
import { getIndoorDirections } from "../../../api/dataService";

const IndoorMap = ({ startLocation, destination }) => {
  const [path, setPath] = useState("");

  const fetchPath = async () => {
    try {
      const data = await getIndoorDirections("foot-walking", startLocation, destination);
      setPath(data);
    } catch (error) {
      //console.error("Error fetching path data: ", error);
    }
  };

  useEffect(() => {
    if (startLocation && destination) {
      fetchPath();
    }
  }, [startLocation, destination]);

  return (
    <View style={styles.container}>
      <Text>ReactNativeZoomableView</Text>
      <View style={{ borderWidth: 5, height: 400, width: "100%" }}>
        <ReactNativeZoomableView
          maxZoom={10}
          minZoom={0.3}
          zoomStep={0.5}
          bindToBorders={true}
          contentWidth={1024}
          contentHeight={1024}
          initialZoom={0.3}
        >
          <ImageBackground style={{ width: 1024, height: 1024, resizeMode: "contain" }} source={Hall8}>
            <Svg style={styles.svg}>
              {path !== "" && <Path d={path.path_data} fill="transparent" stroke="black" strokeWidth="5" />}
            </Svg>
          </ImageBackground>
        </ReactNativeZoomableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "100%",
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
});

export default IndoorMap;
