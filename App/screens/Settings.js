
import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({navigation}) => {

  return (
    <>
    <View style={styles.rootContainer}>

      <View style={styles.rootImageContainer}>
        <Image style={styles.imageMain} source={require("../assets/image_bg_settings_background.png")}/>
        <Image style={styles.logoImage} source={require("../assets/ic_logo_white.png")}/>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{Strings.settings}</Text>
          <View style={styles.headerDivider} />
        </View>
      </View>

      <ScrollView style={{marginTop: '-15%'}}>

      <View>
        <TouchableOpacity onPress={() => {
          navigation.navigate("DeviceConnectionListScreen", {isRightHand: true})}} style={styles.buttonContainer}>
          <Text style={styles.btnText}>{Strings.bluetooth_connection_setup_right_hand}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate("DeviceConnectionListScreen", {isRightHand: false})}} style={styles.buttonContainer}>
          <Text style={styles.btnText}>{Strings.bluetooth_connection_setup_left_hand}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          Alert.alert(
               '',
               Strings.are_you_forget_device_all_devices,
               [
                  {text: Strings.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: Strings.yes, onPress: () => {
                    AsyncStorage.setItem('@rightHand', "")
                    AsyncStorage.setItem('@leftHand', "")
                  }},
               ],
               { cancelable: false }
          )
        }} style={styles.forgotDeviceContainer}>
          <Text style={styles.forgotDeviceText}>{Strings.forget_device}</Text>
        </TouchableOpacity>

      </View>

      </ScrollView>

    </View>
    </>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rootImageContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center'
  },
  imageMain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  logoImage: {
    position: 'absolute',
    width: '70%',
    alignSelf: 'center',
    height: '60%',
    resizeMode: 'contain'
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: ScaleSizeUtils.MEDIUM_SPACING,
  },
  headerText: {
    color: Colors.white,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
    fontSize: TextFontSize.TEXT_SIZE_SEMI_MEDIUM,
    fontFamily: AppFonts.font_medium,
    alignSelf: 'center'
  },
  headerDivider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.white
  },
  buttonContainer: {
    backgroundColor: Colors.primaryColor,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING
  },
  btnText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    fontFamily: AppFonts.font_medium,
    padding: ScaleSizeUtils.MEDIUM_SPACING,
  },
  forgotDeviceContainer: {
    alignSelf: 'flex-end',
  },
  forgotDeviceText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontFamily: AppFonts.font_medium,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
  },
});

export default Settings;
