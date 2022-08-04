
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
import { useSelector, useDispatch } from 'react-redux';
import { UserDetails, UpdateProfile } from "../../actions/authentication";
import Utils from "../../helper/Utils";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ProgressLoader from '../../components/ProgressLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
let deviceHeight = Dimensions.get('window').height

const LoginScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const { isLoading, userData } = useSelector(state => state.Authentication)

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [selectedGender, setSelectedGender] = useState("Male");

  const [age, setAge] = useState(null);

  const [armLengthRight, setArmLengthRight] = useState(null);

  const [armLengthLeft, setArmLengthLeft] = useState(null);

  const [weight, setWeight] = useState(null);

  const [height, setHeight] = useState(null);

  const [glovesLeft, setGlovesLeft] = useState(null);

  const [glovesRight, setGlovesRight] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  const [profilePicture, setprofilePicture] = useState(null);

  const [nameError, setNameError] = useState(null);

  const [emailError, setEmailError] = useState(null);

  const [ageError, setAgeError] = useState(null);

  const [armLengthLeftError, setArmLengthLeftError] = useState(null);

  const [armLengthRightError, setArmLengthRightError] = useState(null);

  const [glovesLeftError, setGlovesLeftError] = useState(null);

  const [glovesRightError, setGlovesRightError] = useState(null);

  const [weightError, setWeightError] = useState(null);

  const [heightError, setHeightError] = useState(null);



  useEffect(() => {
      retriveUserDetails();
  }, [])

  async function retriveUserDetails() {
    if(!Utils.isNetworkAvailable()) {
      return
    }
    var userId = await AsyncStorage.getItem("@id");
    var body ={user_id: userId};
    setLoading(true)
    dispatch(UserDetails(body, (data, isSuccess)=> {
      setLoading(false);
      if(isSuccess) {
        var userDataResponse = data.data;
        setName(userDataResponse.full_name);
        setEmail(userDataResponse.email);
        setSelectedGender(userDataResponse.gender === 1 ? "Male" : "Female");
        setAge(""+userDataResponse.age);
        setArmLengthLeft(""+userDataResponse.arm_length_left);
        setArmLengthRight(""+userDataResponse.arm_length_right);
        setWeight(""+userDataResponse.weight);
        setHeight(""+userDataResponse.height);
        setGlovesRight(""+userDataResponse.arm_weight_right);
        setGlovesLeft(""+userDataResponse.arm_weight_left);
        setCurrentImage(userDataResponse.profile_picture);
      }
    }))
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
                  }, setprofilePicture);
                },
              },
              { text: "Capture from camera", onPress: () => {
                  launchCamera({
                    saveToPhotos: true,
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExtra: true ,
                  }, setprofilePicture);
              }}
            ]
          );
  }

  async function doLogin() {
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

    if(Utils.isStringNull(age)) {
      isValid = false;
      setAgeError("Please enter your age.")
    }

    if(Utils.isStringNull(armLengthLeft)) {
      isValid = false;
      setArmLengthLeftError("Please enter your left arm length.")
    }

    if(Utils.isStringNull(armLengthRight)) {
      isValid = false;
      setArmLengthRightError("Please enter your right arm length.")
    }

    if(Utils.isStringNull(weight)) {
      isValid = false;
      setWeightError("Please enter your weight.")
    }

    if(Utils.isStringNull(height)) {
      isValid = false;
      setHeightError("Please enter your height.")
    }

    if(Utils.isStringNull(glovesLeft)) {
      isValid = false;
      setGlovesLeftError("Please enter your mass of left gloves.")
    }

    if(Utils.isStringNull(glovesRight)) {
      isValid = false;
      setGlovesRightError("Please enter your mass of right gloves.")
    }

    var userId = await AsyncStorage.getItem("@id");

    const formData = new FormData();
    formData.append("full_name", name );
    formData.append('email', email);
    formData.append("device_type", Platform.OS === "ios" ? 1 : 0 );
    formData.append("user_id", userId );
    formData.append("gender", selectedGender === "Male" ? 1 : 2 );
    formData.append("age", age );
    formData.append("arm_length_left", armLengthLeft );
    formData.append("arm_length_right", armLengthRight );
    formData.append("arm_weight_left", glovesLeft );
    formData.append("arm_weight_right", glovesRight );
    formData.append("weight", weight );
    formData.append("height", height );
    formData.append("current_image", currentImage.replace('http://54.164.208.199/assets/upload/users/original/', '')  );
    if(profilePicture && profilePicture.assets && profilePicture.assets.length > 0) {
      // var imageData = {
      //     uri: Platform.OS === 'android' ? profilePicture.assets[0].uri : profilePicture.assets[0].uri.replace('file://', ''),
      //     name: profilePicture.assets[0].fileName,
      //     type: profilePicture.assets[0].type,
      //   };
      //   console.log(imageData);
      formData.append("profile_picture",  { uri: profilePicture.assets[0].uri, name: profilePicture.assets[0].fileName ? profilePicture.assets[0].fileName : 'profile_photo.jpg', type: profilePicture.assets[0].type && profilePicture.assets[0].fileName ? profilePicture.assets[0].type : 'image/jpg' });
    }

    if(isValid) {
      if(!Utils.isNetworkAvailable()) {
        return
      }
      dispatch(UpdateProfile( formData, async (data, isSuccess)=> {
        if(isSuccess) {
          Alert.alert(
            Strings.update_profile,
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
              loading={isLoading||loading}
              dismissLoader={()=>{}} />

          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                  <Image source={require("../../assets/ic_back.png")} style={styles.backIcon} / >
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <Text style={styles.headerText}>{Strings.edit_profile}</Text>
                <View style={{flex: 1}} />
                <TouchableOpacity style={styles.backIcon}>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />
          </View>

      <View style={styles.contentContainer}>

        <TouchableOpacity onPress={() => {
          chooseImage();
        } } >

          <View style={styles.imageContainer}>

            {(profilePicture && profilePicture?.assets && profilePicture?.assets[0].uri) || currentImage ?
            <Image
              source={{uri: profilePicture && profilePicture?.assets[0].uri ? profilePicture?.assets[0].uri : currentImage }}
              style={styles.profilePictureImage} />

              :
              <Image
                source={require("../../assets/ic_camera.png")}
                style={styles.profilePictureDefaultImage} />
            }
            <View style={styles.profilePictureEditContainer} >
              <Image
                source={require("../../assets/ic_edit.png")}
                style={styles.editIconImage} />
            </View>

          </View>

        </TouchableOpacity>

        <Text style={styles.titleText} >{name}</Text>

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

        <Text style={styles.headerLabelText}>{"Gender"}</Text>

        <View style={styles.radioButtonContainer} >

          {[Strings.male, Strings.female].map((data, index) => {
            return (<TouchableOpacity onPress={() =>  {
                setSelectedGender(data);
            } } >
              <View style={styles.radioButtonItemContainer} >
                <Image source={selectedGender !== data ? require("../../assets/ic_radio_unchecked.png") : require("../../assets/ic_radio_checked.png") } style={styles.radioImageIcon} />
                <Text style={styles.radioText} >{data}</Text>
              </View>
            </TouchableOpacity>)
          })
          }

        </View>

        <View style={{flexDirection: 'row'}} >

            <TextInputField
              title={Strings.age}
              value={age}
              keyboardType={"numeric"}
              isValid={(Utils.isStringNull(age) ? false : true)}
              errorText={ageError}
              onChangeValue={(text)=> {
                  setAgeError(null)
                  setAge(text);
              }}
            />

        </View>

        <View style={{flexDirection: 'row'}} >

            <TextInputField
              title={Strings.arm_left_length}
              value={armLengthLeft}
              keyboardType={"numeric"}
              isValid={(Utils.isStringNull(armLengthLeft) ? false : true)}
              errorText={armLengthLeftError}
              onChangeValue={(text)=> {
                  setArmLengthLeftError(null)
                  setArmLengthLeft(text);
              }}
            />

            <View style={{width: ScaleSizeUtils.MEDIUM_SPACING}} />

            <TextInputField
              title={Strings.arm_right_length}
              value={armLengthRight}
              keyboardType={"numeric"}
              isValid={(Utils.isStringNull(armLengthRight) ? false : true)}
              errorText={armLengthRightError}
              onChangeValue={(text)=> {
                  setArmLengthRightError(null)
                  setArmLengthRight(text);
              }}
            />

        </View>

        <View style={{flexDirection: 'row' }} >

          <TextInputField
            title={Strings.weight_label}
            value={weight}
            keyboardType={"numeric"}
            isValid={(Utils.isStringNull(weight) ? false : true)}
            errorText={weightError}
            onChangeValue={(text)=> {
                setWeightError(null)
                setWeight(text);
            }}
          />

          <View style={{width: ScaleSizeUtils.MEDIUM_SPACING}} />

          <TextInputField
            title={Strings.height}
            value={height}
            keyboardType={"numeric"}
            isValid={(Utils.isStringNull(height) ? false : true)}
            errorText={heightError}
            onChangeValue={(text)=> {
                setHeightError("")
                setHeight(text);
            }}
          />

        </View>

        <View style={{flexDirection: 'row' }} >

          <TextInputField
            title={Strings.mass_of_left_gloves}
            value={glovesLeft}
            keyboardType={"numeric"}
            isValid={(Utils.isStringNull(glovesLeft) ? false : true)}
            errorText={glovesLeftError}
            onChangeValue={(text)=> {
                setGlovesLeftError(null)
                setGlovesLeft(text);
            }}
          />

          <View style={{width: ScaleSizeUtils.MEDIUM_SPACING}} />

            <TextInputField
              title={Strings.mass_of_right_gloves}
              value={glovesRight}
              keyboardType={"numeric"}
              isValid={(Utils.isStringNull(glovesRight) ? false : true)}
              errorText={glovesRightError}
              onChangeValue={(text)=> {
                  setGlovesRightError(null)
                  setGlovesRight(text);
              }}
            />

        </View>

        <SubmitButton action={()=>{
          doLogin()
        }} title={Strings.update} />

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
  backIcon: {
    alignSelf: 'center',
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    resizeMode: 'contain',
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    marginTop: ScaleSizeUtils.MEDIUM_SPACING ,
    marginLeft: ScaleSizeUtils.SMALL_SPACING/2,
  },
  radioButtonItemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    width: ScaleSizeUtils.ICON_LARGE_HEIGHT*2, marginTop: "-20%", marginBottom: '5%', overlow: 'hidden', backgroundColor: '#E5E5E5', height: ScaleSizeUtils.ICON_LARGE_HEIGHT*2, borderColor: Colors.primaryColor, borderWidth: 2, borderRadius: ScaleSizeUtils.SMALL_SPACING, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  profilePictureDefaultImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT, height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT
  },
  profilePictureImage: {
    borderRadius: ScaleSizeUtils.SMALL_SPACING/2, width: '100%', height: '100%', resizeMode: 'cover'
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
  radioImageIcon: {
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  radioText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    marginLeft: ScaleSizeUtils.SMALL_SPACING/2,
    marginRight: ScaleSizeUtils.SMALL_SPACING,
    fontFamily: AppFonts.font_bold,
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
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    alignSelf: 'center',
    fontFamily: AppFonts.font_bold,
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
  headerLabelText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginTop: ScaleSizeUtils.MEDIUM_SPACING,
    fontFamily: AppFonts.font_bold,
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
    backgroundColor: Colors.primaryColor,
    height: deviceHeight/(3.5-0.2),
    borderBottomLeftRadius: ScaleSizeUtils.MEDIUM_SPACING,
    borderBottomRightRadius: ScaleSizeUtils.MEDIUM_SPACING,
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
