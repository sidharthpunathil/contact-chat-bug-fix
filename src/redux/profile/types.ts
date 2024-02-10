// src/redux/profile/types.ts

export enum ProfileActionTypes {
  API_RESPONSE_SUCCESS = "@@profile/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@profile/API_RESPONSE_ERROR",
  GET_PROFILE_DETAILS = "@@profile/GET_PROFILE_DETAILS",
}

export interface ProfileState {
  profileDetails: object | null;
  error: string | null;
}

export interface ProfileDetailsType {
  // Define the properties of the profile details here
  // For example:
  id: string;
  name: string;
  email: string;
  // ... other properties
}