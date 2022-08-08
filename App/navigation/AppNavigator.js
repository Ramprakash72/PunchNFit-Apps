import React, {Component} from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import Settings from '../screens/Settings';
import DeviceConnectionListScreen from '../screens/DeviceConnectionListScreen';
import {TabNavigator} from './TabNavigator';
import LoginScreen from '../screens/authentication/LoginScreen';
import SignUpScreen from '../screens/authentication/SignUpScreen';
import EditProfileScreen from '../screens/authentication/EditProfileScreen';
import ForgotPasswordScreen from '../screens/authentication/ForgotPasswordScreen';
import TermsAndConditionScreen from '../screens/authentication/TermsAndConditionScreen';
import SupportScreen from '../screens/SupportScreen';
import AboutUsScreen from '../screens/authentication/AboutUsScreen';
import YoutubeVideoPlayScreen from '../screens/authentication/YoutubeVideoPlayScreen';
import ChangePasswordScreen from '../screens/authentication/ChangePasswordScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}}  />
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown:false}}  />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{headerShown:false}}  />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{headerShown:false}}  />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}}  />
        <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} options={{headerShown:false}}  />
        <Stack.Screen name="YoutubeVideoPlayScreen" component={YoutubeVideoPlayScreen} options={{headerShown:false}}  />
        <Stack.Screen name="TermsAndConditionScreen" component={TermsAndConditionScreen} options={{headerShown:false}}  />
        <Stack.Screen name="SupportScreen" component={SupportScreen} options={{headerShown:false}}  />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown:false}}  />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{headerShown:false}}  />
        <Stack.Screen name="DeviceConnectionListScreen" component={DeviceConnectionListScreen} options={{headerShown:false}} />

      </Stack.Navigator>
      );
}
  export { AppNavigator } ;
