import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigation/NavigationHelper";
import Constants from "../network/Constants";

import authentication from "./authentication";
import home from "./home";



const appReducer = combineReducers({
  Authentication: authentication,
  Home: home,
});



export default (state, action) => {
  if (action.type === Constants.LOGOUT_SUCCESS) {
    state = undefined;
  } else if (
    action !== null &&
    action.hasOwnProperty("status") &&
    action.status !== undefined
  ) {
    if (action.status === 401) {
      setTimeout(async function () {
        await AsyncStorage.clear();
        navigate("LoginScreen", {});
      }, 500);
    }
  }

  return appReducer(state, action);
};
