// src/redux/profile/reducer.ts

import { ProfileActionTypes, ProfileState } from './types'; // Make sure to import ProfileState


const initialState: ProfileState = {
  profileDetails: null,
  error: null,
};

const profileReducer = (state = initialState, action: any) => { // Add type annotation to action
  switch (action.type) {
    case ProfileActionTypes.API_RESPONSE_SUCCESS:
      if (action.payload.actionType === ProfileActionTypes.GET_PROFILE_DETAILS) {
        return {
          ...state,
          profileDetails: action.payload.data,
          error: null,
        };
      }
      break;
    case ProfileActionTypes.API_RESPONSE_ERROR:
      if (action.payload.actionType === ProfileActionTypes.GET_PROFILE_DETAILS) {
        return {
          ...state,
          profileDetails: null,
          error: action.payload.error,
        };
      }
      break;
    default:
      return state;
  }
};

export default profileReducer; // Ensure this is a default export if it's not being exported as named