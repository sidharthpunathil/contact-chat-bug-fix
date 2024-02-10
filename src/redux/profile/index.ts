// src/redux/profile/index.ts

export { getProfileDetails } from './actions';
export { watchGetProfileDetails } from './saga';
import profileReducer from './reducer'; // Import as default if it's a default export
export { profileReducer };