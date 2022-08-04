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


// eslint-disable-next-line react/prefer-stateless-function
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
            {/*<View style={{ marginTop: ScaleSizeUtils.MEDIUM_SPACING/2}}>
              <Image source={require("../assets/ic_speed_meter_background.png")} style={{position: 'absolute', width: '100%', height: ScaleSizeUtils.LARGE_SPACING, resizeMode: 'stretch'}} />

            <Carousel
              ref={this.props.refs}
              scrollEnabled={false}
              data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                    35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
                      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
                      69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                      86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}
              renderItem={this.renderItem}
              style={{width: '100%',}}
              sliderWidth={(Dimensions.get('window').width/3)}
              itemWidth={(Dimensions.get('window').width/2) / 7}
            />
            </View>
            <Image source={require("../assets/ic_speed_indicator.png")} style={{alignSelf: 'center', width: ScaleSizeUtils.ICON_SMALL_HEIGHT, height: ScaleSizeUtils.ICON_SMALL_HEIGHT, marginTop: -ScaleSizeUtils.SMALL_SPACING/2 }} />*/}
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
