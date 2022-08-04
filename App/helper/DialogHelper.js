import { Alert, Platform } from "react-native";
import Utils from "./Utils";
import { Strings } from "../resources";

export default class DialogHelper {
  static showMessage = (header, message) => {
    if (Platform.OS === "ios") {
      setTimeout(() => {
        Alert.alert(
          header,
          message,
          [
            {
              text: "OK",
              style: "default",
            },
          ],
          { cancelable: false }
        );
      }, 500);
    } else {
      Alert.alert(
        header,
        message,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
        { cancelable: false }
      );
    }
  };

  static showAPIMessage = (response) => {
    var message = "";
    if (response && response.hasOwnProperty("response") &&response.response &&response.response.hasOwnProperty("data") &&response.response.data &&response.response.data.hasOwnProperty("message") &&response.response.data.message) {
      message = response.response.data.message;
    } else if (response &&  response !== null &&response.hasOwnProperty("data") && response.data && response.data !== null && response.data.hasOwnProperty("error_description") && !Utils.isStringNull(response.data.error_description)) {
      message = response.data.error_description;
    } else if (response && response !== null && response.hasOwnProperty("data") && response.data && response.data !== null && response.data.hasOwnProperty("message") && !Utils.isStringNull(response.data.message)) {
      message = response.data.message;
    } else if (response && response !== null && response.hasOwnProperty("message") && !Utils.isStringNull(response.message)) {
      message = response.message;
    } else {
      message = Strings.some_thing_went_wrong_please_try_again_later;
    }
    if (
      message !== "Request failed with status code 401" &&
      message !== "Network Error" && message !== "Invalid authorization token."
    ) {
      if (message !== "Request failed with status code 400") {
        if (Platform.OS === "ios") {
          setTimeout(() => {
            Alert.alert('', message);
          }, 500);
        } else {
          Alert.alert('', message);
        }
      }
    }
  };
}
