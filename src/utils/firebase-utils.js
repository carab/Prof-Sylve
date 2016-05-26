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
        this.getRootRef().child('users').child(user.uid).set({
          email: user.email,
          uid: user.uid,
          profile: {
            locale: null,
            friends: [],
            public: false,
            tags: {},
          },
          pokedex: [],
        }).then(() => {
          this.signin(email, password);
        });
      })
      .catch((error) => {
      });
  }

  signin(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
      })
      .catch((error) => {
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
