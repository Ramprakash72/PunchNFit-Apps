import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,} from 'react-native';
import {Colors,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import {getLayoutSize,getFontSize} from '../resources/ResponsiveHelper'


export default function SubmitButton ({title,action,btnstyle}) {

      return(
        <TouchableOpacity style = {[styles.mainViewStyle,btnstyle]} onPress={action}>
          <Text style = {styles.textTitle}>
            {title}
          </Text>
        </TouchableOpacity>
      )
}
const styles = StyleSheet.create({
    mainViewStyle : {
      height : getLayoutSize(55),
      width: '100%',
      alignSelf: 'center',
      flexDirection : "column",
      backgroundColor : Colors.primaryColor,
      elevation: 1,
      justifyContent:"center",
      alignItems:"center",
      marginVertical:ScaleSizeUtils.MEDIUM_SPACING*2,
      borderRadius:ScaleSizeUtils.SMALL_SPACING,
    },
    textTitle : {
      width : "100%",
      fontSize : TextFontSize.TEXT_MEDIUM,
      textAlign : "center",
      color : Colors.white,
      marginHorizontal:ScaleSizeUtils.LARGE_SPACING,
      fontFamily : AppFonts.font_bold
    }
})
