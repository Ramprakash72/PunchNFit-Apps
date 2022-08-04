
import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../../resources/index';
import Utils from "../../helper/Utils";
import { WebView } from 'react-native-webview';
let deviceHeight = Dimensions.get('window').height

const AboutUsScreen = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(true);

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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                  <Image source={require("../../assets/ic_back.png")} style={styles.backIcon} / >
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <Text style={styles.headerText}>{"About Us"}</Text>
                <View style={{flex: 1}} />
                <TouchableOpacity style={styles.backIcon}>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />
          </View>

      <View style={styles.contentContainer}>
            <WebView
              showsHorizontalScrollIndicator={false}
              onLoad={() => setIsLoading(false)}
              showsVerticalScrollIndicator={false}
              source={{ uri: 'http://54.164.208.199/about' }} />
                {isLoading ? <ActivityIndicator style={{position: 'absolute',margin: ScaleSizeUtils.LARGE_SPACING, alignSelf: 'center'}} color={Colors.light_gray} size="large" /> : null}

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
  },
  contentContainer: {
    backgroundColor: Colors.white, borderRadius: ScaleSizeUtils.LARGE_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 4,
    shadowColor: '#000',
    marginTop: '-15%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    backgroundColor: Colors.white,
    height: deviceHeight * 0.79,
    padding: ScaleSizeUtils.SMALL_SPACING*2,
    shadowRadius: 2,
  },
  headerText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    marginBottom: ScaleSizeUtils.SMALL_SPACING*1.4,
    fontFamily: AppFonts.font_medium,
    alignSelf: 'center'
  },
  headerContainer: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
    height: deviceHeight/4,
    borderBottomLeftRadius: ScaleSizeUtils.MEDIUM_SPACING,
    borderBottomRightRadius: ScaleSizeUtils.MEDIUM_SPACING,
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
    backgroundColor: Colors.white
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

export default AboutUsScreen;
