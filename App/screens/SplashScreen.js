
import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Utils from "../helper/Utils";

const SplashScreen = ({navigation}) => {

  useEffect(() => {
    setTimeout(async function () {
      var userId = await AsyncStorage.getItem("@id");
      if(!Utils.isStringNull(userId)) {
        navigation.replace("TabNavigator")
      } else {
        navigation.replace("LoginScreen")
      }
    }, 5000);
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
     <Image style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require("../assets/splash_screen.jpg")}/>
    </View>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 5,
    paddingHorizontal: 5,
    flex: 1,
  },
});

export default SplashScreen;
