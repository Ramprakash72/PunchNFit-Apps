
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
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from '../components/ProgressLoader';
import { Logout } from "../actions/authentication";
import Utils from "../helper/Utils";

let deviceHeight = Dimensions.get('window').height
import { useSelector, useDispatch } from 'react-redux';

const ProfileScreen = ({navigation}) => {

  const dispatch = useDispatch()

  const { isLoading } = useSelector(state => state.Authentication)

  const [email, setEmail] = useState(null);

  function RenderMenuItem(props) {
    return (
      <TouchableOpacity onPress={() => {props.onPress();}}>
        <View style={styles.menuContainer} >
          <Image style={styles.iconImage} source={props.icon} />
          <Text style={styles.menuText} >{props.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  async function doLogout() {
    if(!Utils.isNetworkAvailable()) {
      return
    }
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {text: 'Yes', onPress: async () => {
            var user_id = await AsyncStorage.getItem("@id");
            dispatch(Logout({
              user_id: user_id
            }, async (data, isSuccess)=> {
                AsyncStorage.clear();
                navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginScreen" }]
                      })
            }))
        }},
        {text: 'No', style: 'cancel'},
      ],
      {
        cancelable: true
      }
    );
  }

  return (
    <>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.primaryColor}} >
    <ScrollView style={{flexGrow: 1, backgroundColor: Colors.white }}>
    <View style={styles.rootContainer}>

            <ProgressLoader
              loading={isLoading}
              dismissLoader={()=>{}} />

          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.backIcon} onPress={()=>{navigation.goBack()}}>
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <Text style={styles.headerText}>{Strings.my_profile}</Text>
                <View style={{flex: 1}} />
                <TouchableOpacity style={styles.backIcon}>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />
          </View>

      <View style={styles.contentContainer}>

        <RenderMenuItem onPress={()=>{navigation.navigate("EditProfileScreen")}} icon={require("../assets/ic_edit_profile.png")} text={Strings.edit_profile} />
        <RenderMenuItem onPress={()=>{navigation.navigate("ChangePasswordScreen")}} icon={require("../assets/ic_change_password.png")} text={Strings.change_password} />
        <RenderMenuItem onPress={()=>{navigation.navigate("TermsAndConditionScreen")}} icon={require("../assets/ic_terms_and_condition.png")} text={Strings.terms_and_condition} />
        <RenderMenuItem onPress={()=>{navigation.navigate("AboutUsScreen") }} icon={require("../assets/ic_about.png")} text={Strings.about} />
        <RenderMenuItem onPress={()=>{navigation.navigate("SupportScreen") }} icon={require("../assets/ic_about.png")} text={"Support"} />

      </View>

      <View style={styles.logoutContainer}>

        <RenderMenuItem onPress={()=>{doLogout()}} icon={require("../assets/ic_logout.png")} text={Strings.logout} />

      </View>

    </View>
    </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  iconImage: {
    height: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
    width: ScaleSizeUtils.ICON_SEMI_MEDIUM_HEIGHT,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  backIcon: {
    alignSelf: 'center',
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    resizeMode: 'contain',
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  menuContainer: {
    flexDirection: 'row',
    paddingTop: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
    paddingBottom: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
    width: '100%'
  },
  menuText: {
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    fontFamily: AppFonts.font_semi_bold,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    color: Colors.black,
    alignSelf: 'center',
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
    paddingLeft: ScaleSizeUtils.LARGE_SPACING,
    paddingRight: ScaleSizeUtils.LARGE_SPACING,
    paddingTop: ScaleSizeUtils.LARGE_SPACING,
    paddingBottom: ScaleSizeUtils.LARGE_SPACING,
    shadowRadius: 2,
  },
  logoutContainer: {
    backgroundColor: Colors.white, borderRadius: ScaleSizeUtils.LARGE_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    flex: 1,
    paddingLeft: ScaleSizeUtils.LARGE_SPACING,
    paddingRight: ScaleSizeUtils.LARGE_SPACING,
    paddingTop: ScaleSizeUtils.SMALL_SPACING,
    paddingBottom: ScaleSizeUtils.SMALL_SPACING,
    shadowRadius: 2,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
    height: deviceHeight/4,
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
});

export default ProfileScreen;
