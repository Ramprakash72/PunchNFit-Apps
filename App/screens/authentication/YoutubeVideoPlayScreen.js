
import React, { useState, useEffect, useRef,
} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../../resources/index';
import YoutubePlayer, {YoutubeIframeRef} from "react-native-youtube-iframe";
import Utils from "../../helper/Utils";
let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const LoginScreen = ({navigation, route}) => {

  const playerRef = useRef();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if(!Utils.isNetworkAvailable()) {
      return
    }
  }, [])

  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.primaryColor}} >
    <View style={styles.rootContainer}>

          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                  <Image source={require("../../assets/ic_back.png")} style={styles.backIcon} / >
                </TouchableOpacity>
                <Text style={styles.headerText} numberOfLines={1} >{route.params.title}</Text>
                <TouchableOpacity style={styles.backIcon}>
                </TouchableOpacity>
            </View>
          </View>

      <View style={styles.contentContainer}>
        {isLoading ? <ActivityIndicator style={{margin: ScaleSizeUtils.LARGE_SPACING}} size="small" /> : <View /> }
        <YoutubePlayer
            ref={playerRef}
            height={deviceHeight/3}
            onReady={() => {
              setLoading(false)
            }}
            width={deviceWidth}
            videoId={route.params.videoId.replace("https://youtu.be/", "")}
          />
      </View>

    </View>
    </SafeAreaView>
    </>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.black, borderRadius: ScaleSizeUtils.LARGE_SPACING-ScaleSizeUtils.LARGE_SPACING,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 2,
  },
  headerText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    fontFamily: AppFonts.font_medium,
    flex: 1,
    alignSelf: 'center'
  },
  headerContainer: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
    borderBottomLeftRadius: ScaleSizeUtils.MEDIUM_SPACING-ScaleSizeUtils.MEDIUM_SPACING,
    borderBottomRightRadius: ScaleSizeUtils.MEDIUM_SPACING-ScaleSizeUtils.MEDIUM_SPACING,
  },
  backIcon: {
    alignSelf: 'center',
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    resizeMode: 'contain',
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_LARGE*1.7,
    marginBottom: ScaleSizeUtils.LARGE_SPACING*2,
    fontFamily: AppFonts.font_bold,
  },
  headerDivider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.black
  },
  rootImageContainer: {
    width: '100%',
    height: deviceHeight/2,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center'
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
    marginTop: ScaleSizeUtils.SMALL_SPACING,
  },
  forgotDeviceText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontFamily: AppFonts.font_medium,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
  },
  registerContainer: {
    alignSelf: 'center',
    marginLeft: ScaleSizeUtils.SMALL_SPACING/2,
  },
  registerText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontFamily: AppFonts.font_medium,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
  },
});

export default LoginScreen;
