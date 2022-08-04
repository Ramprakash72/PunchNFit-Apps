
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
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../../resources/index';
import TextInputField from "../../components/TextInputField";
import SubmitButton from "../../components/SubmitButton";
import Utils from "../../helper/Utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from '../../components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import {ForgotPassword} from "../../actions/authentication";
let deviceHeight = Dimensions.get('window').height

import { getUniqueId, getManufacturer } from 'react-native-device-info';

const ForgotPasswordScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const { isLoading } = useSelector(state => state.Authentication)

  const [email, setEmail] = useState(null);

  const [emailError, setEmailError] = useState(null);

  // useEffect({
  //   // setTimeout(function () {
  //   //   navigation.navigate("Settings")
  //   // }, 10);
  // }, [])

  function doForgotPassword() {
    var isValid = true;
    if(Utils.isStringNull(email)) {
      isValid = false;
      setEmailError("Please enter your email address.")
    } else if(!Utils.isEmailValid(email)) {
      isValid = false;
      setEmailError("Please enter valid email address.")
    }

    if(!Utils.isNetworkAvailable()) {
      return
    }

    var body = {
      email: email,
    }

    if(isValid) {
      dispatch(ForgotPassword( body, async (data, isSuccess)=> {
        if(isSuccess) {
          Alert.alert(
            "Forgot Password",
            data.message,
            [
              { text: "Ok", onPress: () => navigation.goBack() }
            ]
          );

        }
      }))
    }

  }

  return (
    <>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.primaryColor}} >

    <ScrollView style={{flexGrow: 1, backgroundColor: Colors.white }}
     keyboardShouldPersistTaps={'handled'}>
      <View style={styles.rootContainer}>

        <ProgressLoader
          loading={isLoading}
          dismissLoader={()=>{}} />

        <View style={styles.rootImageContainer}>
          <Image style={styles.logoImage} source={require("../../assets/ic_logo_white.png")}/>
        </View>

          <TouchableOpacity  style={styles.backContainer} onPress={()=>{navigation.goBack()}}>
            <Image style={styles.backIcon} source={require("../../assets/ic_back.png")} / >
          </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.titleText} >{Strings.forgot_password}</Text>

          <TextInputField
            title={Strings.email_address}
            value={email}
            isValid={(Utils.isStringNull(email) || !Utils.isEmailValid(email) ? false : true)}
            errorText={emailError}
            onChangeValue={(text)=> {
                setEmailError(null);
                setEmail(text);
            }}
          />

          <SubmitButton action={() =>  {doForgotPassword()} } title={Strings.submit} />

        </View>

      </View>
    </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
    </>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backContainer: {
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    resizeMode: 'contain',
    position: 'absolute',
    elevation: 5,
    left: ScaleSizeUtils.MEDIUM_SPACING,
    top: ScaleSizeUtils.MEDIUM_SPACING,
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  backIcon: {
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    resizeMode: 'contain',
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  contentContainer: {
    backgroundColor: Colors.white, borderRadius: ScaleSizeUtils.LARGE_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: '-18%',
    flex: 1,
    padding: ScaleSizeUtils.SMALL_SPACING*2,
    shadowRadius: 2,
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    marginBottom: ScaleSizeUtils.LARGE_SPACING,
    fontFamily: AppFonts.font_bold,
  },
  rootImageContainer: {
    width: '100%',
    height: deviceHeight/2,
    backgroundColor: Colors.primaryColor,
    borderBottomLeftRadius: ScaleSizeUtils.MEDIUM_SPACING,
    borderBottomRightRadius: ScaleSizeUtils.MEDIUM_SPACING,
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
    width: '60%',
    alignSelf: 'center',
    height: '60%',
    bottom: '30%',
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

export default ForgotPasswordScreen;
