
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
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../../resources/index';
import TextInputField from "../../components/TextInputField";
import DeviceInfo from 'react-native-device-info';
import SubmitButton from "../../components/SubmitButton";
import Utils from "../../helper/Utils";
import { useSelector, useDispatch } from 'react-redux';
var sha512 = require('js-sha512');
import {Login} from "../../actions/authentication";
import ProgressLoader from '../../components/ProgressLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUniqueId, getManufacturer } from 'react-native-device-info';

let deviceHeight = Dimensions.get('window').height

const LoginScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const { isLoading } = useSelector(state => state.Authentication)

  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);

  const [emailError, setEmailError] = useState(null);

  const [passwordError, setPasswordError] = useState(null);

  function doLogin() {
    var isValid = true;
    if(Utils.isStringNull(email)) {
      isValid = false;
      setEmailError(Strings.blank_email_address_validation)
    } else if(!Utils.isEmailValid(email)) {
      isValid = false;
      setEmailError(Strings.email_valid_validation)
    }

    if(Utils.isStringNull(password)) {
      isValid = false;
      setPasswordError(Strings.blank_password_validation)
    }

    var body = {
      email: email,
      password: sha512(password),
      device_type: Platform.OS === "ios" ? 1 : 0 ,
      device_token: getUniqueId(),
      device_id: getUniqueId()
    }

    if(isValid) {
      if(!Utils.isNetworkAvailable()) {
        return
      }
      dispatch(Login( body, async (data, isSuccess)=> {
        if(isSuccess) {
          await AsyncStorage.setItem("@userData", JSON.stringify(data.data));
          await AsyncStorage.setItem("@id", JSON.stringify(data.data.id));
          await AsyncStorage.setItem("@authorization_token", data.data.authorization_token);
          navigation.reset({
                  index: 0,
                  routes: [{ name: "TabNavigator" }]
                })
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

      <View style={styles.contentContainer}>
        <Text style={styles.titleText} >{Strings.login}</Text>

        <TextInputField
          title={Strings.email_address}
          value={email}
          isValid={(Utils.isStringNull(email) || !Utils.isEmailValid(email) ? false : true)}
          errorText={emailError}
          onChangeValue={(text)=> {
              setEmailError(null)
              setEmail(text);
          }}
        />

        <TextInputField
          title={Strings.password}
          value={password}
          secureTextEntry={true}
          isValid={Utils.isStringNull(password)}
          errorText={passwordError}
          onChangeValue={(text)=> {
            setPasswordError(null)
            setPassword(text)
          }}
          errorText={passwordError}
        />

        <TouchableOpacity onPress={() => {
            navigation.navigate("ForgotPasswordScreen");
        }} style={styles.forgotDeviceContainer}>
          <Text style={styles.forgotDeviceText}>{Strings.forgot_password_same_line}</Text>
        </TouchableOpacity>

        <SubmitButton action={()=>{
          doLogin()
        }} title={"Login"} />

        <View style={{flexDirection: 'row', alignSelf: 'center' }} >
          <Text style={[styles.registerText, {color: Colors.light_gray}]}> {Strings.dont_have_account}</Text>
          <TouchableOpacity onPress={() => {
                navigation.navigate("SignUpScreen");
          }} style={styles.registerContainer}>
            <Text style={styles.registerText}>{Strings.register}</Text>
          </TouchableOpacity>
        </View>

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
  contentContainer: {
    backgroundColor: Colors.white, borderRadius: ScaleSizeUtils.LARGE_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: '-15%',
    flex: 1,
    padding: ScaleSizeUtils.SMALL_SPACING*2,
    shadowRadius: 2,
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_LARGE*1.7,
    marginBottom: ScaleSizeUtils.LARGE_SPACING*2,
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

export default LoginScreen;
