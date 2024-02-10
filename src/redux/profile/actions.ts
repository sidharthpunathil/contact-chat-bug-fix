// src/redux/profile/actions.ts

import { ProfileActionTypes } from './types';

export const getProfileDetails = () => ({
  type: ProfileActionTypes.GET_PROFILE_DETAILS,
});

export const apiResponseSuccess = (actionType: string, data: any) => ({
  type: ProfileActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const apiResponseError = (actionType: string, error: string) => ({
  type: ProfileActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});