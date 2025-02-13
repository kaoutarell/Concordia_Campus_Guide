import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Hall8 from './Hall-8.png';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Svg, {Path} from 'react-native-svg';
import {getIndoorDirections} from '../../api/dataService';



const IndoorMap = ()=>{
  const [path, setPath] = useState("");
  const start = "H845";
  const destination = "H831";

  const fetchPath = async() =>{
    try{
      const data = await getIndoorDirections("foot-walking", start, destination);
      setPath(data);
    }catch(error){
      console.error("Error fetching path data: ", error);
    }
  }

  useEffect(()=>{
        fetchPath();
      }, [start, destination]);


  return (
    <View style={styles.container}>
      <Text>ReactNativeZoomableView</Text>
      <View style={{ borderWidth: 5, height: 400, width: '100%' }}>
        {/* New component that allows us to zoom and pan the image */}
        <ReactNativeZoomableView
          maxZoom={10}
          minZoom={1}
          zoomStep={0.5}
          bindToBorders={true}
          contentWidth={300}
          contentHeight={150}
        >
          <Image
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            source={Hall8}
          />
          <Svg style={styles.svg}>
        {path!=""&&<Path
          d={path.path_data}
          fill="transparent"
          stroke="red"
          strokeWidth="5"
        />}</Svg>
        </ReactNativeZoomableView>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  svg: {
    position: 'absolute', // Make sure it's positioned on top of the image
    top: 0,
    left: 0,
    width: "100%", // Match the image width
    height: 300, // Match the image height
  },
});

export default IndoorMap
