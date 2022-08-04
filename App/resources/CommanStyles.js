import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image,Dimensions,} from 'react-native';
import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper"
import {TextFontSize,AppFonts } from "../resources/index";
import Colors from './Colors'
import ScaleSizeUtils from './ScaleSizeUtils'
//import AppFonts from "./Fonts";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CommanStyles = StyleSheet.create({

  errorText:{
    color:Colors.red,
    fontSize:TextFontSize.ERROR_TEXT_SIZE+3,
    marginLeft:ScaleSizeUtils.DOT_STYLE_MARGIN,
  },
  modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000010'
    },
  activityIndicator: {
      backgroundColor: '#FFFFFF',
      height: ScaleSizeUtils.LARGE_SPACING * 2,
      width: ScaleSizeUtils.LARGE_SPACING * 2,
      borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
  },
});
export default CommanStyles
