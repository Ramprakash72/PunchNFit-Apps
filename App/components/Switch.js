/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  Animated,
  useColorScheme,
  View,
} from 'react-native';

import ScaleSizeUtils from "../resources/ScaleSizeUtils";
import {getLayoutSize, getFontSize} from "../resources/ResponsiveHelper";
import {Colors, TextFontSize, AppFonts} from "../resources";
const {width} = Dimensions.get('screen')

const Switch= (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const [position] = useState(new Animated.ValueXY())

  const indicatorStyle = {
          position: 'absolute',
          left: 0,
          width: indicatorWidth ,
          borderRadius: ScaleSizeUtils.MEDIUM_SPACING * 2.4,
          height: ScaleSizeUtils.MEDIUM_SPACING*1.8,
          alignSelf: 'center',
          shadowOffset: {width: 1, height: 5},
          shadowOpacity: 0.4,
          shadowColor: Colors.white,
          width: '100%',
          shadowRadius: getLayoutSize(8),
          elevation: 2+3,
          shadowOffset: {width: 1, height: Platform.OS === "ios" ? 1 : 2},
          shadowOpacity: 0.3,
          shadowColor: Colors.primary_color,
          shadowRadius: Platform.OS === "ios" ? 2 : getLayoutSize(8),
          backgroundColor: Colors.primaryColor,
      }


  const backgroundStyle = {
  };

  return (

        <View style={styles.rootContainer(indicatorWidth*2)} >
           {props.tabsArr.map((prop, index) => {
             return (
               <TouchableOpacity
                style={styles.tabParentContainer} onPress={() => {
                 //setSelectedIndex(index)
                 props.setSelectedIndex(index);
               }} >
                  {props.selectedIndex+"" === ""+index ?
                    <Animated.View style={indicatorStyle} >
                    {/*<Shadow style={styles.shadowContainer} />*/}
                    </ Animated.View> :
                    null
                  }
                 <View style={{marginLeft: props.selectedIndex !== index ? 2 : 1 }} />
                 <Animated.View style={styles.tabViewContainer}>
                     <Text style={styles.tabText(props.selectedIndex !== index ? Colors.primaryColor : '#FFFFFF')} >
                       {prop.text}
                     </Text>
                 </Animated.View>
               </TouchableOpacity>
             );
           })}
          </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: (widths) => ({
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingLeft: 2,
    backgroundColor: Colors.white,
    width: width/1.5,
    paddingTop: ScaleSizeUtils.SMALL_SPACING/2,
    marginTop: ScaleSizeUtils.MEDIUM_SPACING,
    marginBottom: ScaleSizeUtils.MEDIUM_SPACING/2,
    paddingBottom: ScaleSizeUtils.SMALL_SPACING/2,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING*2,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    paddingRight: 2,
    alignSelf: 'center',
  }),
  shadowContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary_color,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowColor: Colors.primary_color,
    shadowRadius: getLayoutSize(8),
    borderRadius: getLayoutSize(40),
    width: getLayoutSize(160),
    height: getLayoutSize(56),
  },
  tabParentContainer: {
    alignItems: 'center',
    elevation: 10,
    flex: 1,
    height: ScaleSizeUtils.LARGE_SPACING,
    justifyContent: 'center'
  },
  tabIcon: (color) => ({
    height: ScaleSizeUtils.LARGE_SPACING,
    width: ScaleSizeUtils.LARGE_SPACING,
    resizeMode: 'contain',
    tintColor: color ,
    marginRight: ScaleSizeUtils.SMALL_SPACING
  }),
  tabText: (color) => ({
    color: color,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    flex: 1,
    textAlign: 'center',
    fontFamily: AppFonts.font_bold
  }),
  tabViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ScaleSizeUtils.MEDIUM_SPACING*1.5,
    justifyContent: 'center',
  },
  iconHeader: {
    tintColor: '#484848'
  },
  touchIcon: {
    paddingLeft: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
    paddingTop: ScaleSizeUtils.MEDIUM_SPACING,
    paddingBottom: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
  },
});

export default Switch;
