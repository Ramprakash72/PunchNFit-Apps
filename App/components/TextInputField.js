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
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';

export default class TextInputField extends React.PureComponent<TabbarProps> {

  constructor (props) {
      super(props);
      this.state = {
        isFocus: false,
        isShowPassword: false,
      };
  }

  onFocus() {
    this.setState({
        isFocus: true
    })
  }

  onBlur() {
    this.setState({
      isFocus: false
    })
  }

  render() {
    return (
      <>
      <View style={{flex: 1}}>
      <View style={styles.trackingItemContainer} >
        <View style={{flex: 1}}>
          <Text style={styles.headerLabelText}>{this.props.title}</Text>
          <View style={{flexDirection: 'row', flex: 1}} >
            <TextInput
                {...this.props}
                ref={(input) => {
                  if(this.props.refs)
                    this.props.refs(input);
                }}
                onBlur={ () => this.onBlur() }
                onFocus={ () => this.onFocus() }
                placeholderTextColor={Colors.black}
                secureTextEntry={this.props.secureTextEntry? this.state.isShowPassword ? false: true: false}
                autoCapitalize='none'
                style={[styles.textInputContainer, {...this.props.styles}, {borderBottomColor: this.state.isFocus ? Colors.primaryColor: Colors.light_gray }]}
                onChangeText={(text) => {
                  this.props.onChangeValue(text)
                }}
              />
            {!this.props.secureTextEntry && this.props.isValid ? <Image style={styles.iconCheck} source={require("../assets/ic_check.png")} /> : null}
          </View>
          {this.props.secureTextEntry ?
            <TouchableOpacity onPress={() => this.setState({isShowPassword: !this.state.isShowPassword})}>
              <Image style={styles.iconEye} source={this.state.isShowPassword ? require("../assets/ic_invisible_eye.png") : require("../assets/ic_visible_eye.png")} />
            </TouchableOpacity>
             : null}
        </View>
      </View>
      {this.props.errorText ? <Text style={styles.errorText} >{this.props.errorText}</Text> : null }
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  trackingItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  iconCheck: {
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT*1.2,
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT*1.2,
    position: 'absolute',
    right: ScaleSizeUtils.SMALL_SPACING,
    elevation: 2,
    top: ScaleSizeUtils.SMALL_SPACING,
    resizeMode: 'contain',
  },
  iconEye: {
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT*1.2,
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT*1.2,
    position: 'absolute',
    marginTop: 10,
    marginBottom: 10,
    right: ScaleSizeUtils.SMALL_SPACING,
    elevation: 2,
    bottom: 0,
    resizeMode: 'contain',
  },
  errorText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginTop: ScaleSizeUtils.SMALL_SPACING/2,
    fontFamily: AppFonts.font_regular,
  },
  textInputContainer: {
    backgroundColor: Colors.white,
    color: '#000000',
    borderRadius: ScaleSizeUtils.SMALL_SPACING/2,
    paddingTop: ScaleSizeUtils.SMALL_SPACING,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_gray,
    borderColor: Colors.very_light_gray,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    flex: 1,
    height: ScaleSizeUtils.LARGE_SPACING*1.5,
    paddingBottom: ScaleSizeUtils.SMALL_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING*2,
  },
  headerLabelText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginTop: ScaleSizeUtils.MEDIUM_SPACING,
    fontFamily: AppFonts.font_bold,
  },
  trackingItemValueText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
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
  trackingItemImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    marginLeft: ScaleSizeUtils.MEDIUM_SPACING,
  },
});
