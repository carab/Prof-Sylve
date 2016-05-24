'use strict';

require('firebase/firebase');

class FirebaseUtils {
  constructor() {
    const config = {
      apiKey: 'AIzaSyAa2dt9-n6blULUhfZ1WEm7AC9L_V8f0QM',
      authDomain: 'prof-sylve.firebaseapp.com',
      databaseURL: 'https://prof-sylve.firebaseio.com',
      storageBucket: 'prof-sylve.appspot.com',
    };

    firebase.initializeApp(config);

    this.rootRef = firebase.database().ref();
    this.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  getRootRef() {
    return this.rootRef;
  }

  getUserRef() {
    return this.getRootRef().child('users').child(this.currentUser.uid);
  }

  getUser() {
    return firebase.auth().currentUser;
  }

  signup(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        //console.log(user);
        this.signin(email, password).then((user) => {
          //console.log(user);
          this.getRootRef().child('users').child(user.uid).set({
            email: user.email,
            uid: user.uid,
            token: user.token,
          });
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  }

  signin(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        //console.log(user);
      })
      .catch((error) => {
        //console.log(error);
      });
  }

  signout() {
    firebase.auth().signOut();
  }

  isLoggedIn() {
    return this.currentUser && true || false;
  }

  onAuthStateChanged(cb) {
    firebase.auth().onAuthStateChanged(cb);
  }
}

export default new FirebaseUtils;
