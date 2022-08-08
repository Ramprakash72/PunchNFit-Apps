
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
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
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';

import { BluetoothStatus } from 'react-native-bluetooth-status';

import Switch from '../components/Switch';

import BleManager from 'react-native-ble-manager';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Utils from "../helper/Utils";
import { AddPunchData , ExerciseListing } from "../actions/HomeAction";

const BleManagerModule = NativeModules.BleManager

let width = Dimensions.get('window').width

var Buffer = require('buffer/').Buffer

const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

import TrackingLabel from '../components/TrackingLabel';
import TrackingMeter from '../components/TrackingMeter';
import ProgressLoader from '../components/ProgressLoader';
import Carousel from 'react-native-snap-carousel';

const ExcersiceListingScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const { isLoading, excersicePage , totalExcersicePage, excersiceListingData } = useSelector(state => state.Home)

  const [isDeviceConnected, setDeviceConnected] = useState([]);

  const [loadMore, setLoadMore] = useState(false)

  const flatListRef = useRef();

  const flatListLeftRef = useRef();

  useEffect(() => {
    setLoadMore(true);
    getExcerciseListData(1)
  }, [])

  async function getExcerciseListData(page) {
    if(!Utils.isNetworkAvailable()) {
      return
    }
    var userId = await AsyncStorage.getItem("@id");
    dispatch(ExerciseListing({page: page}))
    setTimeout(function () {
        setLoadMore(false);
      }, 1000);
  }

    const listItem = useCallback(({item, index}) =>
      <TouchableOpacity onPress={() => {
        navigation.navigate("YoutubeVideoPlayScreen", {videoId: item.video_url, title: item.title} )
      } } >
        <View style={styles.itemContainer} >
          <Image resizeMode={'cover'} style={styles.itemImage} source={{uri: "https://img.youtube.com/vi/"+item.video_url.replace("https://youtu.be/", "")+"/0.jpg"}} />
          <Image resizeMode={'cover'} style={styles.itemImageCover} source={require("../assets/image_cover_overlay.png")} />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle} numberOfLines={2} >{item.title}</Text>
            {item.duration ? <View style={styles.textContainer}>
              <Image style={styles.itemImageClock} source={require("../assets/ic_clock.png")} />
              <Text style={styles.itemDurationText}>{item.duration}</Text>
            </View>: null }
          </View>
          <Image resizeMode={'cover'} style={styles.itemPlayIcon} source={require("../assets/ic_play.png")} />
        </View>
      </TouchableOpacity>,
        []
    )

    const keyExtrac = useCallback((item, index) => ""+index, []);

    const itemHeight = ScaleSizeUtils.ICON_LARGE_HEIGHT * 3.5;

    const getItemLayoutView = useCallback((data, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index
    }), [])

    function onLoadMore() {
        if(!loadMore && excersiceListingData && excersiceListingData.length > 8 && totalExcersicePage) {
          if(excersicePage < totalExcersicePage) {
            setLoadMore(true);
            getExcerciseListData(excersicePage+1);
          }
        }
    }

  return (
    <>
    <View style={styles.rootContainer}>
        <View style={{flex: 1}} >
        {excersiceListingData && excersiceListingData.length > 0 ?
            <FlatList
              keyExtractor={keyExtrac}
              maxToRenderPerBatch={10}
              data={excersiceListingData}
              windowSize={10}
              renderItem={listItem}
              contentContainerStyle={{paddingBottom: ScaleSizeUtils.LARGE_SPACING*4}}
              ListFooterComponent={() =>
                loadMore ?
               <ActivityIndicator style={{margin: ScaleSizeUtils.LARGE_SPACING}} size="small" /> : <View />
             }
             onEndReached={({distanceFromEnd}) => {
                  onLoadMore();
             }}
                onEndReachedThreshold={1}
              getItemLayout={getItemLayoutView}
           /> :
           !excersiceListingData ?
            <ActivityIndicator style={{margin: ScaleSizeUtils.LARGE_SPACING, alignSelf: 'center'}} color={Colors.white} size="large" />
          :
          props && props.isShowNoRecordsFound ? <Text style={styles.noRecordsFoundText}>{"No records founds."}</Text> : null
          }
        </View>
    </View>
    </>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  listContainer: {
    width: '100%', height: '100%'
  },
  noRecordsFoundText:{
    color:Colors.light_gray,
    fontSize:TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily:AppFonts.font_semi_bold,
    alignSelf: 'center',
    padding:ScaleSizeUtils.MEDIUM_SPACING,
    marginTop: ScaleSizeUtils.SMALL_SPACING,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING
  },
  itemImageCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemContent: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    paddingTop: ScaleSizeUtils.SMALL_SPACING,
    paddingBottom: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
  },
  itemContainer: {
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    marginLeft: ScaleSizeUtils.MEDIUM_SPACING,
    marginTop: ScaleSizeUtils.MEDIUM_SPACING/2,
    marginBottom: ScaleSizeUtils.MEDIUM_SPACING/2,
    marginRight: ScaleSizeUtils.MEDIUM_SPACING,
    //width: '90%',
    overlow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: ScaleSizeUtils.ICON_LARGE_HEIGHT * 3.5
  },
  itemTitle: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    fontFamily: AppFonts.font_bold,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemDurationText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL-1,
    alignSelf: 'center',
    fontFamily: AppFonts.font_semi_bold,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemPlayIcon: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  itemImageClock: {
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    resizeMode: 'contain',
  },
  rootImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  labelText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    alignSelf: 'center',
    fontFamily: AppFonts.font_medium,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
  },
  labelHeaderContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING/2,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    margin: ScaleSizeUtils.SMALL_SPACING,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: Colors.white
  },
  trackingItemContainer: {
    padding: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: ScaleSizeUtils.SMALL_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: Colors.white
  },
  speedItemContainer: {
    padding: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
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
    margin: ScaleSizeUtils.SMALL_SPACING,
    backgroundColor: Colors.primaryColor
  },
  speedItemHeaderText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_medium,
  },
  trackingItemHeaderText: {
    color: Colors.light_gray,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_medium,
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
    fontFamily: AppFonts.font_semi_bold_italic,
  },
  trackingItemValueText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    fontFamily: AppFonts.font_bold,
  },
  trackingItemImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    marginLeft: ScaleSizeUtils.MEDIUM_SPACING,
  },
  punchCountValueText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    textAlign: 'center',
    fontFamily: AppFonts.font_bold,
  },
  trackingItemValueMeasureTypeText: {
    color: Colors.light_gray,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL-2,
    alignSelf: 'flex-end',
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
    marginLeft: ScaleSizeUtils.SMALL_SPACING/2,
    fontFamily: AppFonts.font_bold,
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

export default ExcersiceListingScreen;
