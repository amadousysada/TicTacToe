import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground,Text, View } from 'react-native';
import Bord  from './components/Bord'
import { Provider } from './provider'

export default function App() {

  

  return (
    
    <Provider>
      <ImageBackground source={require('./rain-storm-ss.gif')} style={styles.container}>
        <Bord />
      </ImageBackground>
    </Provider>
    
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: "cover"
  },
  image: {
    flex: 1,
    
    justifyContent: "center"
  },
});
