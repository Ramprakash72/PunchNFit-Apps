
import React, {Component, useState} from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../screens/Settings';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import ProfileScreen from '../screens/ProfileScreen';

import HomeScreen from '../screens/HomeScreen';

import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';

const tabs = [
  {
    name: 'SETTINGS',
    activeIcon: require("../assets/ic_settings.png"),
    inactiveIcon: require("../assets/ic_settings.png")
  },
  {
    name: 'HOME',
    activeIcon: require("../assets/ic_home.png"),
    inactiveIcon: require("../assets/ic_home.png")
  },
  {
    name: 'PROFILE',
    activeIcon: require("../assets/ic_profile_rounded.png"),
    inactiveIcon: require("../assets/ic_profile_rounded.png")
  },

];

const Stack = createNativeStackNavigator();


const { width } = Dimensions.get("window");
const height = 64;
const tabBarHeight = 80;
const middleIconSize = 50;
const midRadius = 25;
const midBoundary = 60;

const TabNavigator = ({navigation, route}) => {

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [state, setState] = useState({
      pathX: "57",
      pathY: "675",
      pathA: "689",
      pathB: "706",
    });

  const value = new Animated.Value(1);

  const translateX = value.interpolate({
    inputRange: [0, width],
    outputRange: [-width, 0],
  });

  return (
    <View style={{flex: 1}} >



        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown:false}}  />
          <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}  />
        </Stack.Navigator>
        <View style={[styles.tabContainer, {backgroundColor: Colors.primaryColor}]} >

          {tabs.map((data, index) => {
              return(
                <TouchableOpacity style={{flex: 1,}} onPress={() => {
                  setSelectedIndex(index)
                  navigation.replace(index === 0 ? "Settings" : index === 1  ? "HomeScreen" : "ProfileScreen")
                }} >
                <View style={{flex: 1, padding: ScaleSizeUtils.SMALL_SPACING, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.tabViewUnSelectContainer}>
                    <Image source={data.inactiveIcon} style={styles.tabViewUnselectIcon} />
                    <Text style={styles.tabText}>{data.name}</Text>
                  </View>
                    {index === selectedIndex ? <View style={styles.tabSelectedContainer}>
                        <Image source={data.inactiveIcon} style={styles.tabSelectedIcon} />
                    </View> : null}
                </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
    </View>
      );
}
  export { TabNavigator } ;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  tabContainer: {
    position: 'absolute',
    flexDirection: 'row',
    //backgroundColor: Colors.primaryColor,
    width: '90%',
    bottom: ScaleSizeUtils.MEDIUM_SPACING,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING
  },
  tabViewUnSelectContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', alignItems: 'center'
  },
  tabViewUnselectIcon: {
    width: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
          tintColor: Colors.white, height: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
  },
  tabText: {
    color: Colors.white,
    fontFamily: AppFonts.font_medium,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginTop: ScaleSizeUtils.SMALL_SPACING/2
  },
  tabSelectedContainer: {
    shadowColor: '#000',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 0, height:  1 },
    top: -ScaleSizeUtils.MEDIUM_SPACING*1.2,
    shadowOpacity: 0.2,
    borderRadius: ScaleSizeUtils.ICON_MEDIUM_HEIGHT*2,
    padding: ScaleSizeUtils.MEDIUM_SPACING,
    backgroundColor: '#FFFFFF',
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabSelectedIcon: {
    width: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
    tintColor: Colors.primaryColor,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 64,
  },
  activeIcon: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
