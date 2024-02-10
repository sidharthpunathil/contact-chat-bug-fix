import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";


class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setLoggeedInUser(user);
        } else {
          localStorage.removeItem("authUser");
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password, username) => {
    console.log(email);
    console.log(password);
    console.log(username);
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          userCredential => {
            

            const user = userCredential.user;
            console.log(user);
            const userDetails = {
              email: email,
              uid: user.uid,
              username: username,
              // Add any additional user details here
            };
            this.addNewUserToFirestore(user, userDetails);
            resolve(user);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };


  // add new users to firestore
  addNewUserToFirestore = (user, userDetails) => { 
    console.log(userDetails);
    console.log(userDetails.username);
    const collection = firebase.firestore().collection("users");
    const details = {
     
      uid: user.uid,
      email: userDetails.email,
      username:userDetails.username,
      photoUrl: "",
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.doc(user.uid).set(details);
    return { user, details };
  }


  /// add contacts
 /// add contacts
 inviteContact(userId, contactData) {
  console.log(contactData);
  console.log(userId);
  return new Promise((resolve, reject) => {
    const contactRef = firebase.firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts') // Subcollection under the user document
      .doc(); // Create a new document with auto-generated ID

    contactRef.set({
      ...contactData,
      contactId: contactRef.id, // Include the auto-generated ID in the document data
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log('Contact successfully invited');
      resolve();
    })
    .catch(error => {
      console.error('Error inviting contact: ', error);
      reject(error);
    });
  });
}


//fetch contacts

fetchContacts = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, now you can safely access the UID
        const userId = user.uid;
        console.log("userId", userId);


        firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("contacts")
          .get()
          .then(querySnapshot => {
            const contacts = querySnapshot.docs.map(doc => doc.data());
            resolve(contacts);
            console.log(contacts);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          });
      } else {
        // User is signed out
        reject("User is not signed in");
        console.log("User is not signed in");
      }
    });
  });
};


  /// fetch user profile details
  // Example function to fetch user profile details from Firestore
fetchUserProfileDetails(userId) {
  return firebase.firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('No such document!');
      }
    })
    .catch(error => {
      console.error('Error getting document:', error);
    });
}
  

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          user => {
            const currentUser = JSON.stringify(firebase.auth().currentUser);
            resolve(currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */
  socialLoginUser = (data, type) => {
    let credential = {};
    if (type === "google") {
      credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.token
      );
    } else if (type === "facebook") {
      credential = firebase.auth.FacebookAuthProvider.credential(data.token);
    }
    return new Promise((resolve, reject) => {
      if (!!credential) {
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(user => {
            let userL = this.addNewUserToFirestore(user);
            userL = JSON.stringify(userL);
            resolve(userL);
          })
          .catch(error => {
            reject(this._handleError(error));
          });
      } else {
        // reject(this._handleError(error));
      }
    });
  };


  

  // addNewUserToFirestore = user => {
  //   const collection = firebase.firestore().collection("users");
  //   const { profile } = user.additionalUserInfo;
  //   const details = {
  //     firstName: profile.given_name ? profile.given_name : profile.first_name,
  //     lastName: profile.family_name ? profile.family_name : profile.last_name,
  //     fullName: profile.name,
  //     email: profile.email,
  //     picture: profile.picture,
  //     createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
  //     lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
  //   };
  //   collection.doc(firebase.auth().currentUser.uid).set(details);
  //   return { user, details };
  // };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend = null;

const setLoggeedInUser = user => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = config => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export default FirebaseAuthBackend;
export { initFirebaseBackend, getFirebaseBackend, setLoggeedInUser };
