import Constants from '../network/Constants';
import DialogHelper from "../helper/DialogHelper"
const initialState = {
  isLoading: false,
  userData: null,
  excersiceListingData: null,
  totalExcersicePage: null,
  excersicePage: 1,
  locationData: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case Constants.EXCERSICE_LISTING_REQUEST:
            return {
                ...state,
                isLoading:true,
                type: action.type,
                error:action.error
            }
        case Constants.EXCERSICE_LISTING_SUCCESS:
              var excersiceList = action.payload.data;
              if(action.payload.page > 1) {
                excersiceList = [...state.excersiceListingData, ...action.payload.data]
              }
                return {
                  ...state,
                  isLoading:false,
                  excersiceListingData: excersiceList,
                  excersicePage: action.payload.page,
                  totalExcersicePage: action.payload.total_page,
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
        default:
            return state
    }
}
