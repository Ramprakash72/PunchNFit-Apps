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


export default class TrackingLabel extends React.PureComponent<TabbarProps> {

  render() {
    return (
      <>
      <View style={styles.trackingItemContainer} >
                <View style={{flex: 1}}>
                  <Text style={styles.trackingItemHeaderText}>{this.props.title}</Text>
                  <View style={{flexDirection: 'row'}} >
                    <Text style={[styles.trackingItemValueText, {fontSize: this.props.isType ? TextFontSize.TEXT_SIZE_SMALL : TextFontSize.TEXT_SIZE_MEDIUM }]}>{this.props.isType ? this.props.value ? this.props.value : " " : this.props.value ? (""+this.props.value) : 0}</Text>
                    {this.props.measureType ? <Text style={styles.trackingItemValueMeasureTypeText}>{this.props.measureType}</Text> : null}
                  </View>
                </View>
                <Image style={styles.trackingItemImage} source={this.props.icon} />
              </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  trackingItemContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    marginTop: ScaleSizeUtils.SMALL_SPACING/2,
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
    marginRight: ScaleSizeUtils.SMALL_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: Colors.primaryColor
  },
  trackingItemHeaderText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_regular,
  },
  trackingItemValueText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    fontFamily: AppFonts.font_bold,
  },
  trackingItemValueMeasureTypeText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL-2,
    alignSelf: 'flex-end',
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
    marginLeft: ScaleSizeUtils.SMALL_SPACING/2,
    fontFamily: AppFonts.font_regular,
  },
  trackingItemImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    marginLeft: ScaleSizeUtils.MEDIUM_SPACING,
  },
});
