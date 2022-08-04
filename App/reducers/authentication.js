import Constants from '../network/Constants';
import DialogHelper from "../helper/DialogHelper"
const initialState = {
  isLoading: false,
  userData: null,
  excersiceListingData: null,
  locationData: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case Constants.LOGIN_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading:false,
                userData: action.payload.data,
                type: action.type,
                error:undefined
            }
        case Constants.LOGIN_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                isLoading:false,
                userData: action.payload,
                type: action.type,
                error:undefined
            }
        case Constants.UPDATE_PROFILE_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.USER_DETAILS_REQUEST:
            return {
                ...state,
                //isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.USER_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading:false,
                userData: action.payload,
                type: action.type,
                error:undefined
            }
        case Constants.USER_DETAILS_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:undefined
            }
        case Constants.CHANGE_PASSWORD_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.EXCERSICE_LISTING_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.EXCERSICE_LISTING_SUCCESS:
            return {
                ...state,
                isLoading:false,
                excersiceListingData: action.payload,
                type: action.type,
                error:undefined
            }
        case Constants.EXCERSICE_LISTING_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.ADD_PUNCH_DATA_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.ADD_PUNCH_DATA_SUCCESS:
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:undefined
            }
        case Constants.ADD_PUNCH_DATA_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:undefined
            }
        case Constants.FORGOT_PASSWORD_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.NEW_SIGNUP_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
            }
        case Constants.NEW_SIGNUP_SUCCESS:
            return {
                ...state,
                isLoading:false,
                userData: action.payload,
                type: action.type,
            }
        case Constants.NEW_SIGNUP_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        case Constants.LOGOUT_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
            }
        case Constants.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoading:false,
                type: action.type,
            }
        case Constants.LOGOUT_FAILURE:
            DialogHelper.showAPIMessage(action.payload)
            return {
                ...state,
                isLoading:false,
                type: action.type,
                error:action.error
            }
        default:
            return state
    }
}
