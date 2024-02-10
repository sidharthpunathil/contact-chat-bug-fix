import React, { useContext, useEffect, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";
import { createSelector } from "reselect";

import { useDispatch } from 'react-redux';

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import InviteContactModal from "../../../components/InviteContactModal";
import EmptyStateResult from "../../../components/EmptyStateResult";
import ListHeader from "./ListHeader";
import Contact from "./Contact";

// actions
import {
  getContacts,
  inviteContact,
  resetContacts,
  getChannelDetails,
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
} from "../../../redux/actions";

//utils
import { divideByKey, DivideByKeyResultTypes } from "../../../utils";

//firebasebackend
import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import { MyContactContext } from "../../../ContextShare";
import { set } from "date-fns";


interface IndexProps {}

const Index = (props: IndexProps) => {
  // global store
  const { useAppSelector } = useRedux();

  const dispatch = useDispatch();

  //current user id
  const authUser = localStorage.getItem('authUser');
  const currentUserId = authUser ? JSON.parse(authUser).uid : null;

  const errorData = createSelector(
    (state : any) => state.Contacts,
    (state) => ({
      contactsList: state.contacts,
      getContactsLoading: state.getContactsLoading,
      isContactInvited: state.isContactInvited,
    })
  );
  // Inside your component
  const { contactsList,getContactsLoading,isContactInvited} = useAppSelector(errorData);

 

  const {contacts, setContacts}= useContext(MyContactContext)
  // const [contacts, setContacts] = useState<Array<any>>([]);
  const [contactsData, setContactsData] = useState<Array<any>>([]);

    // get contacts

    const fetchContactsFromFirebase = async () => {
      try {
        const firebaseBackendInstance = getFirebaseBackend();
        const fetchedContacts = await firebaseBackendInstance.fetchContacts();
        setContactsData(fetchedContacts);
        setContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    useEffect(() => {
      fetchContactsFromFirebase();
    }, []); // Keep the dependency array empty to run only once
    // console.log(contacts);
    

    
  // useEffect(() => {
  //   if (contactsList.length > 0) {
  //     setContacts(contactsList);
  //   }
  // }, [contactsList]);

  // useEffect(() => {
  //   if (contacts.length > 0) {
  //     const formattedContacts = divideByKey("firstName", contacts);
  //     setContactsData(formattedContacts);
  //   }
  // }, [contacts]);

  /*
  add contact modal handeling
  */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  /*
  onInvite handeling
  */
  const onInviteContact = (data: any) => {
    
    dispatch(inviteContact(data));
  };
  useEffect(() => {
    if (isContactInvited) {
    fetchContactsFromFirebase();
      setIsOpen(false);
      setTimeout(() => {
        dispatch(resetContacts("isContactInvited", false));
      }, 1000);
    }
  }, [dispatch, isContactInvited]);

  /*
  contact search
  */
  const [search, setSearch] = useState("");
  const onChangeSearch = (value: string) => {
    setSearch(value);
    let modifiedContacts = [...contactsList];
    let filteredContacts = (modifiedContacts || []).filter((c: any) =>
      c["firstName"].toLowerCase().includes(value.toLowerCase())
    );
    setContacts(filteredContacts);
  };

  const totalC = (contacts || []).length;
  const onSelectChat = (id: string | number, isChannel?: boolean) => {
    if (isChannel) {
      dispatch(getChannelDetails(id));
    } else {
      dispatch(getChatUserDetails(id));
    }
    dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id));
  };

  return (
    <>
      <div className="position-relative">
        {getContactsLoading && <Loader />}
        <ListHeader
          search={search}
          onChangeSearch={onChangeSearch}
          openModal={openModal}
        />

        <AppSimpleBar className="chat-message-list chat-group-list">
          <div>
            {totalC === 0 ? (
              <EmptyStateResult searchedText={search} />
            ) : (
              (contactsData || []).map(
                (letterContacts: DivideByKeyResultTypes, key: number) => (
                  <Contact
                    // letterContacts={letterContacts}
                    key={key}
                    index={key}
                    onSelectChat={onSelectChat}
                  />
                )
              )
            )}
          </div>
        </AppSimpleBar>
      </div>
      <InviteContactModal
        isOpen={isOpen}
        onClose={closeModal}
        onInvite={onInviteContact}
        userId={currentUserId} // Pass the current user's ID
      />
    </>
  );
};

export default Index;
