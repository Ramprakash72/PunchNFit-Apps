import Constants from '../network/Constants';
import API from '../network/api';
import Utils from '../helper/Utils';


export function AddPunchData(body) {

  return dispatch => {
    dispatch({ type: Constants.ADD_PUNCH_DATA_REQUEST, body: body, isLoading: true })
      return API.post('authentication/add_punchdata', body).then((response) => {
      dispatch({ type: Constants.ADD_PUNCH_DATA_SUCCESS, isLoading: false, response: response.data })
    }).catch((error) => {
      //dispatch({ type: Constants.ADD_PUNCH_DATA_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
    })
  }
}
export function ExerciseListing(body) {

  return dispatch => {
    dispatch({ type: Constants.EXCERSICE_LISTING_REQUEST, body: body, isLoading: true })
      return API.post('exercises/exercises_listing', body).then((response) => {
      dispatch({ type: Constants.EXCERSICE_LISTING_SUCCESS, isLoading: false, payload: response.data })
    }).catch((error) => {
      dispatch({ type: Constants.EXCERSICE_LISTING_FAILURE, isLoading: false, status: !error.response ? 404 : error.response.status, payload: error})
    })
  }
}
