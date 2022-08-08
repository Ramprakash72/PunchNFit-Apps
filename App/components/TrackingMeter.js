import * as React from "react";
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  NativeModules,
  FlatList,
  NativeEventEmitter,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import Carousel from 'react-native-snap-carousel';


export default class TrackingMeter extends React.PureComponent<TabbarProps> {

  renderItem({ item }){
    return (
      <View style={{width: ((Dimensions.get('window').width/2)/7.5), height: Dimensions.get('window').width*0.08, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: Colors.white}}>{item >= 0 ? item : " "}</Text>
      </View>
    )
  };

  render() {
    return (
      <>
      <View style={styles.speedItemContainer} >
        <View style={{flex: 1}}>
            <Text style={styles.speedItemHeaderText}>{"Speed"}</Text>            
            <Text style={styles.speedItemValueText}>{this.props.speed >= 0 ? this.props.speed : "0"}
            <Text style={styles.speedItemSpeedMesureText}> mps</Text></Text>
        </View>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  speedItemContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 2,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    marginTop: ScaleSizeUtils.SMALL_SPACING/2,
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
    marginRight: ScaleSizeUtils.SMALL_SPACING,
    backgroundColor: Colors.primaryColor
  },
  speedItemHeaderText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_regular,
  },
  speedItemValueText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    alignSelf: 'center',
    fontFamily: AppFonts.font_medium,
  },
  speedItemSpeedMesureText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    fontFamily: AppFonts.font_italic,
  },
});
