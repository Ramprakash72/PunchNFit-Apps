//
 import { Alert } from "react-native";
 import NetInfo from "@react-native-community/netinfo";

export default class Utils{

  static async isNetworkAvailable() {
     const response = await NetInfo.fetch();
   try{
     return response.isConnected;
   }
   catch{
     Alert.alert("Alert","Please Connect Your Internet Connections")
   }
 }
    static DialogBox = (text,text1) => {
      setTimeout(() => {
        Alert.alert(text,text1)
      },0);
    }

    static messageDialog = (message) => {
      setTimeout(() => {
        Alert.alert(message)
      }, Platform.OS === 'ios' ? 500 : 0);
    }

    static isStringNull = (text) => {
      const namev = /^[a-zA-Z\s]+$/;

      if(text === '' || text === null || text === '[]' || text === 'null'){
        return true;
      }else if(namev.test(text) === false) {
        return false;
      }else{
        return false;
      }
    }

    static isValueStringNull = (text) => {
      const namev = /^[a-zA-Z\s]+$/;

      if(text === '' || text === null || text === '[]' || text === 'null' || text === "undefined"){
        return true;
      }else if(namev.test(text) === false) {
        return false;
      }else{
        return false;
      }
    }


    static isEmailValid = (text)=>{
      const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       if (regx.test(text) === false ){
         return false;
       }else{
         return true;
       }
    }

    static isNameValid = (text)=>{
      const regn = /^[a-zA-Z\s]+$/;
       if (regn.test(text) === false ){
         return false;
       }else{
         return true;
       }
    }


    static isValidPassword = (value) => {
       if (/^(?=.*[A-Z])(?=.*\d)(?=.*[ !@#$%^&*()_+\-=-`~₹✕\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=-`~₹✕\[\]{};':"\\|,.<>\/?&]{8,}$/.test(value)) {
           return false;
       } else {
           return true;
       }
    }

    }
