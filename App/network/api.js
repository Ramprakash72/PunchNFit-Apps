import store from "../store";
import axios from "axios";
import Utils from "../helper/Utils";

import AsyncStorage from "@react-native-async-storage/async-storage";

var TOKEN = "";
var USER = "";

store.subscribe(listener);

function select(state, key) {
}

function listener() {
}

const BASE_URl = "http://54.164.208.199/app/";
//const BASE_URl = "http://192.168.1.100/punchn_fit/app/";

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const instance = axios.create(defaultOptions);
  instance.defaults.timeout = 45000;
  instance.interceptors.request.use(async (config) => {
    config.url = BASE_URl + config.url;
    var token = null;
    if (Utils.isStringNull(token)) {
      token = await AsyncStorage.getItem("@authorization_token");
    }
    config.headers["authorization-token"] = token;
    return config;
  });
  return instance;
};
export default fetchClient();
