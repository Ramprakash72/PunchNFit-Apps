import React, {Component} from 'react';

import { Button, View, Text, Alert, TouchableOpacity, Image,Icon,Animated } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef, isReadyRef } from "./App/navigation/NavigationHelper";


import { AppNavigator } from './App/navigation/AppNavigator'

const Stack = createNativeStackNavigator();
console.disableYellowBox = true

import store from "./App/store"


export default class App extends Component{
  render() {
  return (
    <Provider store={store}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              isReadyRef.current = true;
            }} >
            <AppNavigator  />
          </NavigationContainer>
    </Provider>
      );
    }
}
