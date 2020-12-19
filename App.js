import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, ImageBackground,Text, View } from 'react-native';
import Bord  from './components/Bord'

const image = { uri: "https://reactjs.org/logo-og.png" };

export default function App() {
  return (
    
    <ImageBackground source={require('./rain-storm-ss.gif')} style={styles.container}>
      <Bord />
    </ImageBackground>
      
    
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
