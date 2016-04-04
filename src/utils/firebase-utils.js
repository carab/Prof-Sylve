'use strict';

import Firebase from 'firebase/lib/firebase-web';

class FirebaseUtils {
  constructor() {
    this.rootRef = new Firebase('https://prof-sylve.firebaseio.com');
  }

  getRootRef() {
    return this.rootRef;
  }

  getUserRef() {
    return this.getRootRef().child('users').child(this.getRootRef().getAuth().uid);
  }

  getUser() {
    return this.cachedUser;
  }

  signup(user, cb) {
    this.getRootRef().createUser(user, (error) => {
      if (error) {
        cb(error.code);
      } else {
        this.signin(user, (error, authData) => {
          if (error) {
            cb(error);
          } else {
            this.getRootRef().child('users').child(authData.uid).set({
              email: user.email,
              uid: authData.uid,
              token: authData.token
            });

            cb(null, authData);
          }
        });
      }
    });
  }

  signin(user, cb) {
    this.getRootRef().authWithPassword(user, (error, authData) => {
      if (error) {
        cb(error.code);
      } else {
        authData.email = user.email;
        this.cachedUser = authData;
        cb(null, authData);
      }
    });
  }

  signout() {
    this.getRootRef().unauth();
    this.cachedUser = null;
  }

  isLoggedIn() {
    return this.cachedUser && true || this.getRootRef().getAuth() || false;
  }

  onAuth(cb) {
    this.getRootRef().onAuth((authData) => {
      cb(authData);
    });
  }
}

export default new FirebaseUtils;
