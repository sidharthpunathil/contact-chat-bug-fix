// src/redux/profile/saga.ts

import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { ProfileActionTypes } from "./types";
import { getProfileDetails, apiResponseSuccess, apiResponseError } from './actions';
import { getProfileDetails as getProfileDetailsApi } from "../../api/index"; // Make sure this import is correct

// Define the return type of the getProfileDetailsApi function
interface ProfileDetails {
  // Define the properties of the profile details here
  // For example:
  id: string;
  name: string;
  email: string;
  // ... other properties
}

function* getProfileDetailsSaga() {
  try {
    // Specify the return type of the getProfileDetailsApi call
    const response: ProfileDetails = yield call(getProfileDetailsApi);
    yield put(apiResponseSuccess(ProfileActionTypes.GET_PROFILE_DETAILS, response));
  } catch (error: any) {
    yield put(apiResponseError(ProfileActionTypes.GET_PROFILE_DETAILS, error.message));
  }
}

export function* watchGetProfileDetails() {
  yield takeEvery(ProfileActionTypes.GET_PROFILE_DETAILS, getProfileDetailsSaga);
}

function* profileSaga() {
  yield all([fork(watchGetProfileDetails)]);
}

export default profileSaga;