import Constants from '../network/Constants';
import API from '../network/api';
import Utils from '../helper/Utils';


export function SignUp(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.NEW_SIGNUP_REQUEST, body: body, isLoading: true })
      return API.post('authentication/user_signup', body, {
        headers: {
            'content-type': 'multipart/form-data'
        }}).then((response) => {
      dispatch({ type: Constants.NEW_SIGNUP_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.NEW_SIGNUP_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function Login(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.LOGIN_REQUEST, body: body, isLoading: true })
      return API.post('authentication/login', body).then((response) => {
      dispatch({ type: Constants.LOGIN_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.LOGIN_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function Logout(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.LOGOUT_REQUEST, body: body, isLoading: true })
      return API.post('authentication/logout', body).then((response) => {
      dispatch({ type: Constants.LOGOUT_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.LOGOUT_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function UpdateProfile(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.UPDATE_PROFILE_REQUEST, body: body, isLoading: true })
      return API.post('authentication/update_profile', body, {
        headers: {
            'content-type': 'multipart/form-data'
        }}).then((response) => {
      dispatch({ type: Constants.UPDATE_PROFILE_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.UPDATE_PROFILE_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function UserDetails(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.USER_DETAILS_REQUEST, body: body, isLoading: true })
      return API.post('authentication/userDetail', body).then((response) => {
      dispatch({ type: Constants.USER_DETAILS_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.USER_DETAILS_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function ChangePassword(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.CHANGE_PASSWORD_REQUEST, body: body, isLoading: true })
      return API.post('authentication/changepassword', body).then((response) => {
      dispatch({ type: Constants.CHANGE_PASSWORD_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.CHANGE_PASSWORD_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}

export function ForgotPassword(body, callback) {

  return dispatch => {
    dispatch({ type: Constants.FORGOT_PASSWORD_REQUEST, body: body, isLoading: true })
      return API.post('authentication/forgotPassword', body).then((response) => {
      dispatch({ type: Constants.FORGOT_PASSWORD_SUCCESS, isLoading: false, payload: response.data })
      callback(response.data, true)
    }).catch((error) => {
      dispatch({ type: Constants.FORGOT_PASSWORD_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
      callback(error.response, false)
    })
  }
}
