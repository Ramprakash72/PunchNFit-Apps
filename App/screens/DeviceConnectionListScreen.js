
import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Image,

  FlatList,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import {
} from 'react-native/Libraries/NewAppScreen';

import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BluetoothStatus } from 'react-native-bluetooth-status';

import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager

var Buffer = require('buffer/').Buffer

const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const App = ({navigation, route}) => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const [connectableList, setConnectableList] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [notificationValueList, setNotificationValueList] = useState([]);


  const startScan = () => {
    bluetoothCheck();
    if (!isScanning) {
      BleManager.scan([], 3, true).then((results) => {
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }

  const handleStopScan = () => {
    setIsScanning(false);
  }

  async function bluetoothCheck() {
    const isEnabled = await BluetoothStatus.state();
    if(isEnabled == true){
     } else{
        Alert.alert(
          '',
          'Please turn on bluetooth.'
        );
      }
  }

  const handleDisconnectedPeripheral = (data) => {
    // let peripheral = peripherals.get(data.peripheral);
    // if (peripheral) {
    //   peripheral.connected = false;
    //   peripherals.set(peripheral.id, peripheral);
    //   console.log("Dataaa  => "+JSON.stringify(peripherals));
    //   //setConnectableList(Array.from(peripherals.values()));
    // }
    //retrieveConnected();
  }

  const handleUpdateValueForCharacteristic = (data) => {
        const buffer = Buffer.from(data.value);

        const decodedValue = buffer.readFloatLE(0, true);

        let valueListSelected = notificationValueList.filter(item => item.characteristicId !== data.characteristic);
             setNotificationValueList([...valueListSelected, {value: decodedValue, characteristicId: data.characteristic}])
    // console.log("Data ====> "+bin2String(data.value) );
    // console.log("Data ====> "+ toHexString(data.value));
    // console.log("Data ====> "+ convertStringToByteArray("48"));
    //
    // console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, "aaa "+data.value);
  }
function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
    const peripherals = new Map();
      if (results.length == 0) {
      }
      //console.log(""+JSON.stringify(results));
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripheral.isConntected = true;
        peripherals.set(peripheral.id, peripheral);
        // for (var a = 0; a < peripheral.characteristics.length; a++) {
        //   if(peripheral.characteristics[a].properties.includes("Read")) {
        //     BleManager.startNotification(peripheral.id, peripheral.characteristics[a].service, peripheral.characteristics[a].characteristic);
        //   } else if(peripheral.characteristics[a].properties.includes("Write")) {
        //     BleManager.write(
        //         peripheral.id,
        //         peripheral.characteristics[a].service,
        //         peripheral.characteristics[a].characteristic,
        //         convertStringToByteArray("28")
        //       )
        //         .then(() => {
        //           // Success code
        //           console.log("Write: " + convertStringToByteArray("28"));
        //         })
        //         .catch((error) => {
        //           // Failure code
        //           console.log(error);
        //         });
        //   }
        // }
      }
    });
  }
  function convertStringToByteArray(str){
    String.prototype.encodeHex = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
     bytes.push(this.charCodeAt(i));
    }
    return bytes;
    };

    var byteArray = str.encodeHex();
    return byteArray
  }

  function toHexString(byteArray) {
      var s = '0x';
      byteArray.forEach(function(byte) {
        s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
      });
      return s;
    }

  const handleDiscoverPeripheral = (peripheral) => {
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }

  const testPeripheral = (peripheral) => {
    if (peripheral){
      BleManager.connect(peripheral.id).then(() => {
        let p = peripherals.get(peripheral.id);

        if(route.params.isRightHand) {
          AsyncStorage.setItem('@rightHand', peripheral.id)
        } else {
          AsyncStorage.setItem('@leftHand', peripheral.id)
        }
        setConnectedDevice(peripheral.id);

        navigation.goBack()

      }).catch((error) => {

      });
    }

  }

  function isConnectedVirtualBLE(id) {
    var data = connectableList.filter(function(item){
       return item.id == id;
    }).map(function(item){
        return item;
    });
    return data.length > 0 ? true : false;
  }

  useEffect(() => {
    BleManager.start({showAlert: true, restoreIdentifierKey: "222", queueIdentifierKey: "333"});
    const handleDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
          if (result) {
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
              } else {
              }
            });
          }
      });
    }

    return (() => {
      handleDiscover.remove();
    })
  }, []);

  async function getRightDevice() {
    var rightId = await AsyncStorage.getItem('@rightHand')
    if(rightId) {
      isConnectedVirtualBLE(rightId)
      setConnectedDevice(rightId);
    }
  }

  const renderItem = (item) => {
    return (
        <View style={{flexDirection: 'row',
        shadowColor: '#000',
        backgroundColor: Colors.white,
        borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
        padding: ScaleSizeUtils.SMALL_SPACING,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: ScaleSizeUtils.MEDIUM_SPACING,
        shadowOpacity: 0.2,
        shadowRadius: 2,}}>
            <View style={styles.deviceViewContainer}>
              <Text style={styles.deviceNameText}>{item.name}</Text>
              <Text style={styles.deviceRCIText}>RSSI: {item.rssi}</Text>
              <Text style={styles.deviceIDText}>{item.id}</Text>
            </View>
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => testPeripheral(item) }>
                <Text style={styles.deviceConnectedText}>{"Connect"}</Text>
              </TouchableOpacity>
        </View>
    );
  }

  const renderConnectedItem = (item) => {
    const color = item.isConntected ? '#fff' : '#fff';
    return (
      <TouchableHighlight>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 18, textAlign: 'center', color: '#333333', padding: 10}}>{item.characteristicId}</Text>
          <Text style={{fontSize: 14, textAlign: 'center', color: '#333333', padding: 2}}>{item.value}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  //var connectedList = isConnectedVirtualBLE(connectedDevice);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={{flexGrow: 1}} >
          <View style={styles.body}>

          <View style={styles.headerView}>
            <View style={styles.headerContainer}>
              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Image source={require("../assets/ic_back.png")} style={styles.backIcon} / >
                  </TouchableOpacity>
                  <View style={{flex: 1}} />
                  <Text style={styles.headerText}>{route.params.isRightHand ? "Bluetooth Connection Setup Right Hand": "Bluetooth Connection Setup Left Hand"}</Text>
                  <View style={{flex: 1}} />
                  <TouchableOpacity style={styles.backIcon}>
                  </TouchableOpacity>
              </View>
              <View style={styles.headerDivider} />
            </View>

              <View style={{marginTop: 40,alignSelf: 'center'}}>
                <TouchableOpacity onPress={()=>{startScan()}}>
                  <Image source={require("../assets/ic_bluetooth_icon.png")} style={styles.bluetoothIcon} / >
                  <Text style={styles.headerText}>{"Scan your bluetooth device"}</Text>
                </TouchableOpacity>
              </View>
          </View>

            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }

            {isScanning &&
              <View style={{flex:1, marginTop: 20}}>
                <Text style={{textAlign: 'center'}}>Scanning...</Text>
              </View>
            }

            <FlatList
                data={list}
                style={{flex: 1, padding: ScaleSizeUtils.MEDIUM_SPACING, paddingBottom: 200}}
                renderItem={({ item }) => renderItem(item) }
                keyExtractor={item => item.id}
              />

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  deviceViewContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING,
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: ScaleSizeUtils.MEDIUM_SPACING,
  },
  backIcon: {
    alignSelf: 'center',
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    marginTop: 2,
    resizeMode: 'contain',
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
  },
  deviceNameText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    fontFamily: AppFonts.font_medium,
  },
  bluetoothIcon: {
    width: '100%',
    alignSelf: 'center',
    width: ScaleSizeUtils.ICON_VERY_LARGE_HEIGHT * 1.7,
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    marginRight: ScaleSizeUtils.SMALL_SPACING,
    marginTop: ScaleSizeUtils.SMALL_SPACING*4,
    marginBottom: ScaleSizeUtils.SMALL_SPACING,
    height: ScaleSizeUtils.ICON_VERY_LARGE_HEIGHT * 1.7,
  },
  deviceConnectedText: {
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    padding :ScaleSizeUtils.SMALL_SPACING,
    fontFamily: AppFonts.font_medium,
  },
  deviceRCIText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_medium,
  },
  deviceIDText: {
    color: Colors.light_gray,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_medium,
  },
  headerView: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
    borderBottomLeftRadius: ScaleSizeUtils.LARGE_SPACING,
    borderBottomRightRadius: ScaleSizeUtils.LARGE_SPACING,
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
  },
  logoImage: {
    position: 'absolute',
    width: '70%',
    alignSelf: 'center',
    height: '60%',
    resizeMode: 'contain'
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  headerText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    marginBottom: ScaleSizeUtils.SMALL_SPACING*1.4,
    fontFamily: AppFonts.font_medium,
    alignSelf: 'center'
  },
  headerDivider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.white
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
