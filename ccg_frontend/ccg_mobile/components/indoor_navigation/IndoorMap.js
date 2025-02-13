import React, { useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Hall8 from './Hall-8.png';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';



const IndoorMap = ()=>{

  return (
    <View style={styles.container}>
      <Text>ReactNativeZoomableView</Text>
      <View style={{ borderWidth: 5, height: 400, width: '100%' }}>
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
});

export default IndoorMap
