
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
import {SignUp} from "../../actions/authentication";
import { useSelector, useDispatch } from 'react-redux';
var sha512 = require('js-sha512');

import { getUniqueId, getManufacturer } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from '../../components/ProgressLoader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

let deviceHeight = Dimensions.get('window').height

const LoginScreen = ({navigation}) => {

  const dispatch = useDispatch()

  const { isLoading } = useSelector(state => state.Authentication)

  const [name, setName] = useState(null);

  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);

  const [nameError, setNameError] = useState(null);

  const [emailError, setEmailError] = useState(null);

  const [passwordError, setPasswordError] = useState(null);

  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  // useEffect({
  //   // setTimeout(function () {
  //   //   navigation.navigate("Settings")
  //   // }, 10);
  // }, [])

  function doLogin() {
    var isValid = true;

    if(Utils.isStringNull(name)) {
      isValid = false;
      setNameError(Strings.blank_name_validation)
    }

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

    if(Utils.isStringNull(confirmPassword)) {
      isValid = false;
      setConfirmPasswordError(Strings.blank_confirm_password_validation)
    } else if(password !== confirmPassword) {
      isValid = false;
      setConfirmPasswordError(Strings.mismatch_confirm_password_validation)
    }

    if(!profilePicture) {
      if(isValid) {
        alert("Please select profile picture.")
      }
      isValid = false;
    }

    if(isValid) {
      if(!Utils.isNetworkAvailable()) {
        return
      }
      const formData = new FormData();
      formData.append("full_name", name );
      formData.append('email', email);
      formData.append("device_type", Platform.OS === "ios" ? 1 : 0 );
      formData.append("password", sha512(password));
      formData.append("device_token", getUniqueId() );
      formData.append("device_id", getUniqueId() );
        if(profilePicture && profilePicture.assets && profilePicture.assets.length > 0) {
          var imageData = {
              uri: Platform.OS === 'android' ? profilePicture.assets[0].uri : profilePicture.assets[0].uri.replace('file://', ''),
              name: profilePicture.assets[0].fileName,
              type: profilePicture.assets[0].type,
            };
          formData.append("profile_picture",  { uri: profilePicture.assets[0].uri, name: 'profile_photo.jpg', type: 'image/jpg' });
        }

      dispatch(SignUp(formData, async (data, isSuccess)=> {
        if(isSuccess) {
          await AsyncStorage.setItem("@userData", JSON.stringify(data.data));
          await AsyncStorage.setItem("@id", JSON.stringify(data.data.user_id));
          await AsyncStorage.setItem("@authorization_token", data.data.authorization_token);
          navigation.reset({
                  index: 0,
                  routes: [{ name: "TabNavigator" }]
                })
        }
      }))



    }

  }

  function chooseImage() {
    Alert.alert(
            "Select",
            "Please choose your profile picture.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Ask me later pressed"),
                style: "cancel"
              },
              {
                text: "Choose from gallery",
                onPress: async () => {
                  launchImageLibrary({
                    selectionLimit: 1,
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExtra: true,
                  }, setProfilePicture);
                },
              },
              { text: "Capture from camera", onPress: () => {
                  launchCamera({
                    saveToPhotos: true,
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExtra: true ,
                  }, setProfilePicture);
              }}
            ]
          );
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

      <View style={styles.rootImageContainer}>
        <Image style={styles.logoImage} source={require("../../assets/ic_logo_white.png")}/>
      </View>

      <View style={styles.contentContainer}>

        <ProgressLoader
          loading={isLoading}
          dismissLoader={()=>{}} />

      <TouchableOpacity onPress={() => {
        chooseImage();
      } } >

        <View style={styles.imageContainer}>

          {!profilePicture || !profilePicture?.assets || !profilePicture?.assets[0].uri ?
            <Image
              source={require("../../assets/ic_camera.png")}
              style={styles.profilePictureDefaultImage} />

            :
            <Image
              source={{uri: profilePicture?.assets[0].uri}}
              style={styles.profilePictureImage} />
          }
          <View style={styles.profilePictureEditContainer} >
            <Image
              source={require("../../assets/ic_edit.png")}
              style={styles.editIconImage} />
          </View>

        </View>

      </TouchableOpacity>

        <Text style={styles.titleText} >{Strings.register}</Text>

        <TextInputField
          title={Strings.name}
          value={name}
          isValid={(Utils.isStringNull(name) ? false : true)}
          errorText={nameError}
          onChangeValue={(text)=> {
              setNameError(null)
              setName(text);
          }}
        />

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
        }} title={"Register"} />

        <View style={{flexDirection: 'row', alignSelf: 'center' }} >
          <Text style={[styles.registerText, {color: Colors.light_gray}]}> {Strings.already_have_account}</Text>
          <TouchableOpacity onPress={() => {
            navigation.replace("LoginScreen")
          }} style={styles.registerContainer}>
            <Text style={styles.registerText}>{Strings.login}</Text>
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
    backgroundColor: Colors.white,
    borderRadius: ScaleSizeUtils.LARGE_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: '-15%',
    overlow: 'hidden',
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
  imageContainer: {
    width: ScaleSizeUtils.ICON_LARGE_HEIGHT*2,
    marginTop: "-20%",
    marginBottom: '5%',
    overlow: 'hidden',
    backgroundColor: '#E5E5E5',
    height: ScaleSizeUtils.ICON_LARGE_HEIGHT*2,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: ScaleSizeUtils.SMALL_SPACING,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePictureDefaultImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT
  },
  profilePictureImage: {
    borderRadius: ScaleSizeUtils.SMALL_SPACING/2,
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  profilePictureEditContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING/2,
    overlow: 'hidden',
    backgroundColor: Colors.primaryColor,
    borderTopLeftRadius: 2,
    borderBottomRightRadius: ScaleSizeUtils.SMALL_SPACING,
    position: 'absolute',
    bottom: -2,
    right: -2
  },
  editIconImage: {
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
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
