
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
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
  Dimensions,
  Button,
  StyleSheet,
} from 'react-native';
import {Colors,Strings,AppFonts,ScaleSizeUtils,TextFontSize} from '../resources/index';

import { BluetoothStatus } from 'react-native-bluetooth-status';

import Switch from '../components/Switch';

import BleManager from 'react-native-ble-manager';
import Utils from "../helper/Utils";
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails, UpdateProfile } from "../actions/authentication";
import { AddPunchData , ExerciseListing } from "../actions/HomeAction";

const BleManagerModule = NativeModules.BleManager

let width = Dimensions.get('window').width

var Buffer = require('buffer/').Buffer

const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

import TrackingLabel from '../components/TrackingLabel';
import TrackingMeter from '../components/TrackingMeter';
import ExcersiceListingScreen from './ExcersiceListingScreen';
import ProgressLoader from '../components/ProgressLoader';
import Carousel from 'react-native-snap-carousel';

const emptyObject = {
      punch_type: 0,
      momentum: 0,
      joule: 0,
      kci: 0,
      speed: 0,
      punch_count: 0,
    };

const SplashScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const { isLoading, excersiceListingData } = useSelector(state => state.Home)

  const peripherals = new Map();
  const [leftConnectedDevice, setLeftConnectedDevice] = useState(null);
  const [rightConnectedDevice, setRightConnectedDevice] = useState(null);
  const [isDeviceConnected, setDeviceConnected] = useState([]);
  const [velocityLeft, setVelocityLeft] = useState(0);
  const [velocityRight, setVelocityRight] = useState(0);
  const [momentumLeft, setMomentumLeft] = useState(0);
  const [momentumRight, setMomentumRight] = useState(0);
  const [punchTypeLeft, setPunchTypeLeft] = useState("");
  const [punchTypeRight, setPunchTypeRight] = useState("");
  const [punchKCILeft, setPunchKCILeft] = useState(0);
  const [punchKCIRight, setPunchKCIRight] = useState(0);
  const [punchCountLeft, setPunchCountLeft] = useState(0);
  const [punchCountRight, setPunchCountRight] = useState(0);
  const [callAPICall, setCallAPICall] = useState(0);
  const [selectedTabs, setSelectedTabs] = useState(0);

  const [glovesLeft, setGlovesLeft] = useState(1.5);

  const [glovesRight, setGlovesRight] = useState(1.5);

  const [joulsLeft, setJoulsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [joulsRight, setJoulsRight] = useState(0);
  const [leftData, setLeftData] = useState({jouls: 0, momentum: 0, velocity: 0});
  const [rightData, setRightData] = useState({jouls: 0, momentum: 0, velocity: 0});
  const [weightGloubs, setWeigthGloubs] = useState(17);
  const [lastMovmentLeftTime, setLastMovementLeft] = useState(null);
  const [lastMovmentRightTime, setLastMovementRight] = useState(null);

  var punchDataLeftArray = [emptyObject]
  var [punchLeftDataArray, setPunchDataLeftArray] = useState([])
  var punchDataRightArray = [emptyObject]
  var [punchRightDataArray, setPunchRightDataArray] = useState([])
  var result = [51,
          52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
          69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
          86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];

  const flatListRef = useRef();

  const flatListLeftRef = useRef();

  useEffect(() => {
    retriveUserDetails();
  }, [])

  async function addPunchNdata() {
    if(!Utils.isNetworkAvailable()) {
      return
    }
    if(punchLeftDataArray && punchLeftDataArray.length > 0 || punchRightDataArray && punchRightDataArray.length > 0) {
      var userId = await AsyncStorage.getItem("@id");
      var body ={
          user_id: userId,
          left_data: punchLeftDataArray,
          right_data: punchRightDataArray,
      };

      setPunchDataLeftArray([]);
      punchDataLeftArray = [emptyObject]
      setPunchRightDataArray([]);
      punchDataRightArray = [emptyObject]
      dispatch(AddPunchData(body))
      //setPunchDataArray([])
    }
  }

  const submitButton = useRef();

  const refreshButton = useRef();

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
        setGlovesRight(""+userDataResponse.arm_weight_right);
        setGlovesLeft(""+userDataResponse.arm_weight_left);
        setTimeout(function () {
          bluetoothCheck();
        }, 1000);
      }
    }))
  }

  useEffect(() => {
    var id;
    //if(isDeviceConnected && isDeviceConnected.length > 0)
    //{
    id = setInterval(() => {
        if(isDeviceConnected) {
          submitButton.current.props.onPress();
        }
        refreshButton.current.props.onPress();
    }, 5000);
    //}
    return () => id ? clearInterval(id):null;
  }, [isDeviceConnected, submitButton]);

  function refreshValue() {
  // setVelocityRight(0);
  //   setVelocityLeft(0);
    // if(flatListRef && flatListRef.current)
    //   flatListRef.current.snapToItem(0, true, true );
    // if(flatListLeftRef && flatListLeftRef.current)
    // flatListLeftRef?.current?.snapToItem(0, true , true )
    if(lastMovmentRightTime) {
      var secondBetweenTwoDate = Math.abs((new Date().getTime() - lastMovmentRightTime.getTime()) / 1000);
      if(secondBetweenTwoDate > 5) {
        setVelocityRight(0);
        setLastMovementRight(null);
      }
    }
    if(lastMovmentLeftTime) {
      var secondBetweenTwoDate = Math.abs((new Date().getTime() - lastMovmentLeftTime.getTime()) / 1000);
      if(secondBetweenTwoDate > 5) {
        setVelocityLeft(0);
        setLastMovementLeft(null);
      }
    }
  }

  async function bluetoothCheck() {
    const isEnabled = await BluetoothStatus.state();
    if(isEnabled == true){
      BleManager.start({showAlert: true, restoreIdentifierKey: "222", queueIdentifierKey: "333"}).then(() => {
        init();
      }).catch((error) => {
        alert("Unable to connect");
      });
     } else{
        Alert.alert(
          '',
          Strings.please_turn_on_bluetooth
        );
      }
  }

  const TabsArray = [{text: Strings.data}, {text: Strings.exercises}];

  useEffect(() => {
    if(leftConnectedDevice || rightConnectedDevice) {
      const handleDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      const handleDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      const handleCharacterisctics = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

      setTimeout(async function () {
        const isEnabled = await BluetoothStatus.state();
        if(isEnabled == true){
          if(leftConnectedDevice)
          await BleManager.isPeripheralConnected(
            leftConnectedDevice,
            []
          ).then(async (isConnected) => {
            if (isConnected) {
              retriveServices(leftConnectedDevice, true);
            } else {
              await connectDevice(leftConnectedDevice, true)
            }
          }).catch((error)=> {

            setLoading(false);
          });
          if(rightConnectedDevice)
          await BleManager.isPeripheralConnected(
            rightConnectedDevice,
            []
          ).then(async (isConnected) => {
            if (isConnected) {
              retriveServices(rightConnectedDevice, false);
            } else {
              await connectDevice(rightConnectedDevice, false)
            }
          }).catch((error)=> {

            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }, 1000);
      return (async () => {
        handleDisconnect.remove()
        handleDiscover.remove()
        handleCharacterisctics.remove();
         if(leftConnectedDevice)
           await BleManager.disconnect(leftConnectedDevice);
         if(rightConnectedDevice)
           await   BleManager.disconnect(rightConnectedDevice);
      })
    }

  }, [leftConnectedDevice, rightConnectedDevice])

  async function init() {
    // const timeout = setTimeout(() => {
    //   //flatListRef.current.snapToItem(10, true, true);
    // }, 1060)

    var leftId = await AsyncStorage.getItem('@leftHand')
    if(leftId) {
      setLeftConnectedDevice(leftId)
    }
    var rightId = await AsyncStorage.getItem('@rightHand')
    if(rightId) {
      setRightConnectedDevice(rightId);
    }
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

  function connectDevice(id, isLeftDevice) {
    setTimeout(function () {
      if(id) {
        BleManager.connect(id).then(() => {
          setDeviceConnected(prev=> [...prev, {id}])
          let p = peripherals.get(id);

          setTimeout(() => {

            retriveServices(id, isLeftDevice);

          }, 900);
        }).catch((error) => {
          setLoading(false);
          alert("Unable to "+(isLeftDevice ? "left" : "right" )+ " connect");
        });
      } else {
        setLoading(false);
      }
    }, 1000);
  }

  function retriveServices(peripheral_id, isLeftDevice) {
    BleManager.retrieveServices(peripheral_id).then(async (peripheralData) => {

    //console.log("Data =====> "+JSON.stringify(peripheralData));

      for (var a = 0; a < peripheralData.characteristics.length; a++) {
        if(Platform.OS === "ios"){
          if(peripheralData.characteristics[a].properties.includes("Read")) {
            await BleManager.stopNotification(peripheralData.id, peripheralData.characteristics[a].service, peripheralData.characteristics[a].characteristic)
            await BleManager.startNotification(peripheralData.id, peripheralData.characteristics[a].service, peripheralData.characteristics[a].characteristic).then(()=>{
            });
          } else if(peripheralData.characteristics[a].properties.includes("Write")) {
            await BleManager.write(
                peripheralData.id,
                peripheralData.characteristics[a].service,
                peripheralData.characteristics[a].characteristic,
                convertStringToByteArray(isLeftDevice ? glovesLeft: glovesRight)
              );
          }
        } else {
          if(peripheralData.characteristics[a].properties.Read) {
            await BleManager.stopNotification(peripheralData.id, peripheralData.characteristics[a].service, peripheralData.characteristics[a].characteristic)
            await BleManager.startNotification(peripheralData.id, peripheralData.characteristics[a].service, peripheralData.characteristics[a].characteristic);
          } else if(peripheralData.characteristics[a].properties.Write) {
            await BleManager.write(
                peripheralData.id,
                peripheralData.characteristics[a].service,
                peripheralData.characteristics[a].characteristic,
                convertStringToByteArray(isLeftDevice ? glovesLeft: glovesRight)
              )
                .then(() => {
                  // Success code
                  //console.log("Write: " + convertStringToByteArray("28"));
                })
                .catch((error) => {
                  // Failure code
                  //console.log(error);
                });
          }
        }
      }
      setLoading(false);
    }).catch((error) => {
    setLoading(false);
      alert("Unable to read data.");
    });;
  }

  const handleDisconnectedPeripheral = (data) => {
    let filteredArray = isDeviceConnected.filter(item => item !== data.peripheral)
    setDeviceConnected(filteredArray)
    if(data.peripheral === rightConnectedDevice) {
      alert("Right hand device disconnected");
    } else if(data.peripheral === leftConnectedDevice) {
      alert("Left hand device disconnected");
    }
  }

  const handleDiscoverPeripheral = (peripheral) => {
  }

  const useDebounce = (
    fn: (...args: any[]) => any,
    delay: number,
    deps: any[]
  ) => {
    const callback = useCallback(fn, deps)

    useEffect(() => {
      const handler = setTimeout(() => {
        callback()
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [callback])
  }


  const startScan = () => {
    BleManager.scan([], 3, true).then((results) => {
    }).catch(err => {
      console.error(err);
    });
  }

  const setVelocityRightCallBack = useCallback(
    (value) => {
      if (!value) return;
      setVelocityRight(value);
    },
    [setVelocityRight]
  );

  const setVelocityLeftCallBack = useCallback(
    (value) => {
      if (!value) return;
      setVelocityLeft(value);
    },
    [setVelocityLeft]
  );

  const setMomentumLeftCallBack = useCallback(
    (value) => {
      if (!value) return;
      setMomentumLeft(value);
    },
    [setMomentumLeft]
  );

  const setMomentumRightCallBack = useCallback(
    (value) => {
      if (!value) return;
      setMomentumRight(value);
    },
    [setMomentumRight]
  );

  const setJoulsLeftCallBack = useCallback(
    (value) => {
      if (!value) return;
      setJoulsLeft(value);
    },
    [setJoulsLeft]
  );

  const setKCILeftCallBack = useCallback(
    (value) => {
      if (!value) return;
      setPunchKCILeft(value);
    },
    [setPunchKCILeft]
  );

  const setKCIRightCallBack = useCallback(
    (value) => {
      if (!value) return;
      setPunchKCIRight(value);
    },
    [setPunchKCIRight]
  );

  const setJoulsRightCallBack = useCallback(
    (value) => {
      if (!value) return;
      setJoulsRight(value);
    },
    [setJoulsRight]
  );

  function setPunchData(punchType, type, value) {
    var values = emptyObject;
    var index = -1;
    var punchData = []
    if(punchType === "left") {
      punchData = JSON.parse(JSON.stringify(punchDataLeftArray));
    } else {
      punchData = JSON.parse(JSON.stringify(punchDataRightArray));
    }
    switch (type) {
      case 'speed':
        index = punchData.findIndex(obj => obj.speed === 0)
        if(index !== -1) {
          const newArray = [...punchData];
          newArray[index].speed = value;
          punchData = newArray;
        } else {
            values.speed = value;
            punchData = [...punchData, values]
        }
        break;
      case 'punch_type':
        index = punchData.findIndex(obj => obj.punch_type === 0)
        if(index !== -1) {
          const newArray = [...punchData];
          newArray[index].punch_type = value;
          punchData = newArray;
        } else {
          values.punch_type = value;
          punchData = [...punchData, values]
        }
        break;
      case 'joule':
        index = punchData.findIndex(obj => obj.joule === 0)
        if(index !== -1) {
          const newArray = [...punchData];
          newArray[index].joule = value;
          newArray[index].kci = (value/4186.781).toFixed(3);
          punchData = newArray;
        } else {
          values.joule = value;
          values.kci = (value/4186.781).toFixed(3);
          punchData = [...punchData, values]
        }
        break;
      case 'momentum':
        index = punchData.findIndex(obj => obj.momentum === 0)
        if(index !== -1) {
          const newArray = [...punchData];
          newArray[index].momentum = value;
          punchData = newArray;
        } else {
          values.momentum = value;
          punchData = [...punchData, values]
        }
        break;
      case 'punch_count':
        index = punchData.findIndex(obj => obj.punch_count === 0)
        if(index !== -1) {
          const newArray = [...punchData];
          newArray[index].punch_count = value;
          punchData = newArray;
        } else {
          values.punch_count = value;
          punchData = [...punchData, values]
        }
        break;
      default:

    }

    if(punchType === "left") {
      punchDataLeftArray = [...punchData];
      setPunchDataLeftArray(punchData);
    } else {
      punchDataRightArray = [...punchData];
      setPunchRightDataArray(punchData);
    }

  }

  const handleUpdateValueForCharacteristic = (data) => {
        // var leftConnectedDevice = await AsyncStorage.getItem('@leftHand')
        // var rightConnectedDevice = await AsyncStorage.getItem('@rightHand')
        try {

        const buffer = Buffer.from(data.value);

        const decodedValue = buffer.readInt8(0);

        if(data.service.toUpperCase() === "ECB48F12-1BD0-4161-9DAE-9EFAB22F62A8") {
            if(data.peripheral === rightConnectedDevice) {
              setLastMovementRight(new Date());
              setVelocityRightCallBack(decodedValue > 0 ? decodedValue : 0);
              if(flatListRef && flatListRef.current)
                flatListRef.current.snapToItem(decodedValue > 0 ? decodedValue:0, true, true );

              setPunchData("right", "speed", decodedValue)
            } else if(data.peripheral === leftConnectedDevice) {
              setLastMovementLeft(new Date());
              if(flatListLeftRef && flatListLeftRef.current)
                flatListLeftRef?.current?.snapToItem(decodedValue > 0 ? decodedValue:0, true , true )

              setVelocityLeftCallBack( decodedValue > 0 ? decodedValue : 0 );
              setPunchData("left", "speed", decodedValue)
            }
        }

        if(data.service.toUpperCase() === "7136237E-ACDA-4AF7-9AF4-112A64DD4D3C") {
            if(data.peripheral === rightConnectedDevice) {
              setMomentumRightCallBack(decodedValue);
              //setPunchDataMomentumArray(prev=> [...prev, decodedValue])
              setPunchData("right", "momentum", decodedValue)

            } else if(data.peripheral === leftConnectedDevice) {
              setMomentumLeftCallBack(decodedValue);
              setPunchData("left", "momentum", decodedValue)
            }
        }

        if(data.service.toUpperCase() === "0B37C1DC-6027-44B7-8707-A06C6253A2A7") {
            if(data.peripheral === rightConnectedDevice) {
              setJoulsRightCallBack(decodedValue);
              setKCIRightCallBack((decodedValue/4186.781).toFixed(3))
              setPunchData("right", "joule", decodedValue)
            } else if(data.peripheral === leftConnectedDevice) {
              setKCILeftCallBack((decodedValue/4186.781).toFixed(3))
              setJoulsLeftCallBack(decodedValue);
              setPunchData("left", "joule", decodedValue)
            }
        }
        if(data.characteristic.toUpperCase() === "0000fd1d-0000-1000-8000-00805f9b34fb".toUpperCase() || data.characteristic.toUpperCase() === "FD1D".toUpperCase()) {


            if(data.peripheral === rightConnectedDevice) {
              setPunchTypeRight(buffer.readUIntBE(0, data.value.length));
              setPunchData("right", "punch_type", buffer.readUIntBE(0, data.value.length))
            } else if(data.peripheral === leftConnectedDevice) {
              setPunchTypeLeft(buffer.readUIntBE(0, data.value.length));
              setPunchData("left", "punch_type", buffer.readUIntBE(0, data.value.length))
            }
        }
        if(data.characteristic.toUpperCase() === "0000fd1e-0000-1000-8000-00805f9b34fb".toUpperCase() || data.characteristic.toUpperCase() === "FD1E".toUpperCase()) {


            if(data.peripheral === rightConnectedDevice) {
              setPunchCountRight(buffer.readUIntBE(0, data.value.length));

              setPunchData("right", "punch_count", buffer.readUIntBE(0, data.value.length))

            } else if(data.peripheral === leftConnectedDevice) {
              setPunchCountLeft(buffer.readUIntBE(0, data.value.length));

              setPunchData("left", "punch_count", buffer.readUIntBE(0, data.value.length))

            }
        }
      } catch (error) {
        //console.log(error);
      }

  }

  function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
  }

    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then(async (results) => {
      const peripherals = new Map();
        if (results.length == 0) {
        }
        //console.log(""+JSON.stringify(results));
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripheral.isConntected = true;
          peripherals.set(peripheral.id, peripheral);
          for (var a = 0; a < peripheral.characteristics.length; a++) {
            if(peripheral.characteristics[a].properties.includes("Read")) {
              await BleManager.startNotification(peripheral.id, peripheral.characteristics[a].service, peripheral.characteristics[a].characteristic);
            } else if(peripheral.characteristics[a].properties.includes("Write")) {
              await BleManager.write(
                  peripheral.id,
                  peripheral.characteristics[a].service,
                  peripheral.characteristics[a].characteristic,
                  convertStringToByteArray("14")
                );
            }
          }
        }
      });
    }

  function HeaderTypeLabel({title}) {
    return (<View style={styles.labelHeaderContainer} >
              <Text style={styles.labelText}>{title}</Text>
            </View>
          )
  }

  // function TrackingValueLabel({title, value, measureType, icon}) {
  //   return (<View style={styles.trackingItemContainer} >
  //             <View style={{flex: 1}}>
  //               <Text style={styles.trackingItemHeaderText}>{title}</Text>
  //               <View style={{flexDirection: 'row'}} >
  //                 <Text style={styles.trackingItemValueText}>{value}</Text>
  //                 {measureType ? <Text style={styles.trackingItemValueMeasureTypeText}>{measureType}</Text> : null}
  //               </View>
  //             </View>
  //             <Image style={styles.trackingItemImage} source={icon} />
  //           </View>
  //         )
  // }

  function PunchCountLabel({title, value}) {
    return (<View style={styles.trackingItemContainer} >
              <View style={{flex: 1}}>
                <Text style={styles.trackingItemHeaderText}>{title}</Text>
                <Text style={styles.punchCountValueText}>{value}</Text>
              </View>
            </View>
          )
  }

  function RenderSpeedItem({refs, value}) {

  }

  const exerciseListItem = ({item, index }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate("YoutubeVideoPlayScreen", {videoId: item.video_url} )
    } } >
      <View style={styles.itemContainer} >
        <Image resizeMode={'cover'} style={styles.itemImage} source={{uri: "https://img.youtube.com/vi/"+item.video_url.replace("https://youtu.be/", "")+"/0.jpg"}} />
        <Image resizeMode={'cover'} style={styles.itemImageCover} source={require("../assets/image_cover_overlay.png")} />
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} >{item.title}</Text>
          {item.duration ? <View style={styles.textContainer}>
            <Image style={styles.itemImageClock} source={require("../assets/ic_clock.png")} />
            <Text style={styles.itemDurationText}>{item.duration}</Text>
          </View>: null }
        </View>
        <Image resizeMode={'cover'} style={styles.itemPlayIcon} source={require("../assets/ic_play.png")} />
      </View>
    </TouchableOpacity>
  )

  let myList = useRef();

  function getPunchType(value) {
    switch (value) {
      case 1:
        return "Cross_Punch"
        break;
      case 2:
        return "Hook_Punch"
        break;
      case 3:
        return "Straight_Punch"
        break;
      case 4:
        return "Upper_Cut_Punch"
        break;
      case 5:
        return "Random_Punch"
        break;
      default:

    }
  }

  function submitData() {
      addPunchNdata();
  }


  return (
    <>
    <SafeAreaView style={styles.rootContainer}>
    <View style={styles.rootContainer}>

      <View style={styles.rootImageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{Strings.Home}</Text>
          <View style={styles.headerDivider} />
        </View>

        <ProgressLoader loading={loading} />
        <View style={{marginTop: ScaleSizeUtils.SMALL_SPACING}}>
          <Switch
            tabsArr={TabsArray}
            setSelectedIndex={(selectedTabs) => {
              setSelectedTabs(selectedTabs);
            }} selectedIndex={selectedTabs} />

        </View>

        {selectedTabs === 0 ?
        <ScrollView
          style={{ paddingBottom: 40, }}
          contentContainerStyle={{paddingBottom: ScaleSizeUtils.LARGE_SPACING*4}} >
          <View style={{flex: 1}} >

        <View style={{flexDirection: 'row'}} >
          <HeaderTypeLabel
            title={Strings.left_hand} />
          <HeaderTypeLabel
            title={Strings.right_hand} />
        </View>

        <View style={{flexDirection: 'row'}} >
          <TrackingLabel
            title={Strings.punch_type}
            value={getPunchType(punchTypeLeft)}
            isType={true}
            icon={require("../assets/ic_punch_type_white.png")} />
          <TrackingLabel
            title={Strings.punch_type}
            value={getPunchType(punchTypeRight)}
            isType={true}
            icon={require("../assets/ic_punch_type_white.png")} />
        </View>

        <View style={{flexDirection: 'row'}} >
          <TrackingLabel
            title={Strings.momentumn}
            value={momentumLeft}
            measureType={Strings.kg_ms}
            icon={require("../assets/ic_momentumn_white.png")} />
          <TrackingLabel
            title={Strings.momentumn}
            value={momentumRight}
            measureType={Strings.kg_ms}
            icon={require("../assets/ic_momentumn_white.png")} />
        </View>

        <View style={{flexDirection: 'row'}} >

          <TrackingLabel
            title={Strings.joule_header}
            value={joulsLeft}
            measureType={Strings.joules}
            icon={require("../assets/ic_joules_white.png")} />

          <TrackingLabel
            title={Strings.joule_header}
            value={joulsRight}
            measureType={Strings.joules}
            icon={require("../assets/ic_joules_white.png")} />

        </View>

        <View style={{flexDirection: 'row'}} >
          <TrackingLabel
            title={Strings.kci}
            value={punchKCILeft}
            measureType={Strings.kci}
            icon={require("../assets/ic_kci_white.png")} />
          <TrackingLabel
            title={Strings.kci}
            value={punchKCIRight}
            measureType={Strings.kci}
            icon={require("../assets/ic_kci_white.png")} />
        </View>

        <View style={{flexDirection: 'row'}} >
          <TrackingMeter
            speed={velocityLeft}
            refs={flatListLeftRef} />
          <TrackingMeter
            speed={velocityRight}
            refs={flatListRef} />
        </View>

        <View style={{flexDirection: 'row'}} >
          <PunchCountLabel
            title={Strings.punch_count}
            value={punchCountLeft} />
          <PunchCountLabel
            title={Strings.punch_count}
            value={punchCountRight} />
        </View>

        <View style={{width: 0, height: 0, opacity: 0,}}>
        <Button
           ref={submitButton}
           buttonStyle={{ width: 0, height: 0, opacity: 0, display: "none" }}
           title={""}
           onPress={submitData}
         />

         <Button
            ref={refreshButton}
            buttonStyle={{ width: 0, height: 0, opacity: 0, display: "none" }}
            title={""}
            onPress={refreshValue}
          />
          </View>

        </View>
        </ScrollView> :
        <ExcersiceListingScreen isShowNoRecordsFound={true} navigation={navigation} />
      }


      </View>

    </View>
    </SafeAreaView>
    </>
  );
};

{/* + (isScanning ? 'on' : 'off') + ') */}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    width: '100%', height: '100%'
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING
  },
  itemImageCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemContent: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    paddingTop: ScaleSizeUtils.SMALL_SPACING,
    paddingBottom: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
  },
  itemContainer: {
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    margin: ScaleSizeUtils.MEDIUM_SPACING,
    //width: '90%',
    overlow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: ScaleSizeUtils.ICON_LARGE_HEIGHT * 3.5
  },
  itemTitle: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    fontFamily: AppFonts.font_bold,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemDurationText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL-1,
    alignSelf: 'center',
    fontFamily: AppFonts.font_semi_bold,
    padding: ScaleSizeUtils.SMALL_SPACING/2,
  },
  itemPlayIcon: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  itemImageClock: {
    width: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    height: ScaleSizeUtils.ICON_SMALL_HEIGHT,
    resizeMode: 'contain',
  },
  rootImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  labelText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    alignSelf: 'center',
    fontFamily: AppFonts.font_bold,
    padding: ScaleSizeUtils.SMALL_SPACING/3,
  },
  labelHeaderContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING/2,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    marginTop: ScaleSizeUtils.SMALL_SPACING/2,
    marginBottom: ScaleSizeUtils.SMALL_SPACING/2,
    marginRight: ScaleSizeUtils.SMALL_SPACING,
    shadowColor: '#000',
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    backgroundColor: Colors.white
  },
  trackingItemContainer: {
    padding: ScaleSizeUtils.SMALL_SPACING,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: ScaleSizeUtils.SMALL_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: Colors.primaryColor
  },
  speedItemContainer: {
    padding: ScaleSizeUtils.SEMI_MEDIUM_SPACING,
    paddingLeft: ScaleSizeUtils.MEDIUM_SPACING,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
    elevation: 2,
    borderRadius: ScaleSizeUtils.MEDIUM_SPACING,
    flex: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    margin: ScaleSizeUtils.SMALL_SPACING,
    backgroundColor: Colors.primaryColor
  },
  speedItemHeaderText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_medium,
  },
  trackingItemHeaderText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    fontFamily: AppFonts.font_regular,
  },
  speedItemValueText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    alignSelf: 'center',
    fontFamily: AppFonts.font_medium,
  },
  speedItemSpeedMesureText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_VERY_SMALL,
    marginLeft: ScaleSizeUtils.SMALL_SPACING,
    fontFamily: AppFonts.font_semi_bold_italic,
  },
  trackingItemValueText: {
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    fontFamily: AppFonts.font_bold,
  },
  trackingItemImage: {
    width: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    height: ScaleSizeUtils.ICON_MEDIUM_HEIGHT,
    marginLeft: ScaleSizeUtils.MEDIUM_SPACING,
  },
  punchCountValueText: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE,
    textAlign: 'center',
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
  headerContainer: {
    width: '100%',
  },
  headerText: {
    color: Colors.black,
    paddingBottom: ScaleSizeUtils.SMALL_SPACING/2,
    fontSize: TextFontSize.TEXT_SIZE_SEMI_MEDIUM,
    fontFamily: AppFonts.font_medium,
    alignSelf: 'center'
  },
  headerDivider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.black
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
  },
  forgotDeviceText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontFamily: AppFonts.font_medium,
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    paddingRight: ScaleSizeUtils.MEDIUM_SPACING,
  },
});

export default SplashScreen;
