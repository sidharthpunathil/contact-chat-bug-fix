import { call, put, select, takeEvery, all, fork } from 'redux-saga/effects';

//  Redux States
import { ContactsActionTypes } from "./types";
import {
  contactsApiResponseSuccess,
  contactsApiResponseError,
} from "./actions";

// api
import {
  getContacts as getContactsApi,
  inviteContact as inviteContactApi,
} from "../../api/index";

// fiebase backend  
import { getFirebaseBackend } from "../../helpers/firebase_helper";

// helpers
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../helpers/notifications";

// Define the action type for inviting a contact
// Define the action type for inviting a contact
interface InviteContactAction {
  type: typeof ContactsActionTypes.INVITE_CONTACT;
  payload: {
    userId: string;
    contactData: any; // Replace 'any' with the actual type of contactData
  };
}

function* inviteContact(action: InviteContactAction): Generator {
  try {
    const firebaseHelper = getFirebaseBackend(); // Use the getFirebaseBackend function to get the instance
    const { userId, contactData } = action.payload;
    const response = yield call(firebaseHelper.inviteContact, userId, contactData);
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.INVITE_CONTACT, response)
    );
    // Optionally, show a success notification
    yield call(showSuccessNotification, 'Contact successfully invited');
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(
      contactsApiResponseError(ContactsActionTypes.INVITE_CONTACT, error)
    );
  }
}


function* getContacts({ payload: filters }: any) {
  try {
    const response: Promise<any> = yield call(getContactsApi, filters);
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.GET_CONTACTS, response)
    );
  } catch (error: any) {
    yield put(
      contactsApiResponseError(ContactsActionTypes.GET_CONTACTS, error)
    );
  }
}



export function* watchGetContacts() {
  yield takeEvery(ContactsActionTypes.GET_CONTACTS, getContacts);
}

export function* watchInviteContact() {
  yield takeEvery(ContactsActionTypes.INVITE_CONTACT, inviteContact);
}

function* contactsSaga() {
  yield all([fork(watchGetContacts), fork(watchInviteContact)]);
}

export default contactsSaga;