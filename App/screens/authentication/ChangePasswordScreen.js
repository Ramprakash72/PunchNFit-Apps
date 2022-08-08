
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
import SubmitButton from "../../components/SubmitButton";
import Utils from "../../helper/Utils";
import { useSelector, useDispatch } from 'react-redux';
import ProgressLoader from '../../components/ProgressLoader';
var sha512 = require('js-sha512');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChangePassword} from "../../actions/authentication";
let deviceHeight = Dimensions.get('window').height

const ChangePasswordScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const [oldPassowrd, setOldPassowrd] = useState(null);

  const [password, setPassword] = useState(null);

  const { isLoading } = useSelector(state => state.Authentication)

  const [confirmPassword, setConfirmPassword] = useState(null);

  const [oldPasswordError, setOldPasswordError] = useState(null);

  const [passwordError, setPasswordError] = useState(null);

  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  async function doLogin() {
    var isValid = true;

    if(Utils.isStringNull(oldPassowrd)) {
      isValid = false;
      setOldPasswordError(Strings.blank_current_password_validation)
    }

    if(Utils.isStringNull(password)) {
      isValid = false;
      setPasswordError(Strings.blank_new_password_validation)
    }

    if(Utils.isStringNull(confirmPassword)) {
      isValid = false;
      setConfirmPasswordError(Strings.blank_confirm_password_validation)
    } else if(password !== confirmPassword) {
      isValid = false;
      setConfirmPasswordError(Strings.mismatch_confirm_password_validation)
    }

    var userId = await AsyncStorage.getItem("@id");

    var body = {
      user_id: userId,
      password: sha512(oldPassowrd),
      new_password: sha512(password),
    }

    if(isValid) {
      if(!Utils.isNetworkAvailable()) {
        return
      }
      dispatch(ChangePassword( body, async (data, isSuccess)=> {
        if(isSuccess) {
          Alert.alert(
            "Change Password",
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

      <ProgressLoader
        loading={isLoading}
        dismissLoader={()=>{}} />

    <View style={styles.rootContainer}>

          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                  <Image source={require("../../assets/ic_back.png")} style={styles.backIcon} / >
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <Text style={styles.headerText}>{Strings.change_password}</Text>
                <View style={{flex: 1}} />
                <TouchableOpacity style={styles.backIcon}>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />
          </View>

      <View style={styles.contentContainer}>

        <TextInputField
          title={Strings.current_password}
          value={oldPassowrd}
          isValid={(Utils.isStringNull(oldPassowrd) ? false : true)}
          secureTextEntry={true}
          errorText={oldPasswordError}
          onChangeValue={(text)=> {
              setOldPasswordError(null)
              setOldPassowrd(text);
          }}
        />

        <TextInputField
          title={Strings.new_password}
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

        <TextInputField
          title={Strings.confirm_password}
          value={confirmPassword}
          secureTextEntry={true}
          isValid={Utils.isStringNull(confirmPassword)}
          errorText={confirmPasswordError}
          onChangeValue={(text)=> {
            setConfirmPasswordError(null)
            setConfirmPassword(text)
          }}
          errorText={confirmPasswordError}
        />

        <SubmitButton action={()=>{
          doLogin()
        }} title={Strings.change_password} />

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

export default ChangePasswordScreen;
