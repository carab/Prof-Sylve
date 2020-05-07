import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAa2dt9-n6blULUhfZ1WEm7AC9L_V8f0QM',
  authDomain: 'prof-sylve.firebaseapp.com',
  databaseURL: 'https://prof-sylve.firebaseio.com',
  projectId: 'prof-sylve',
  storageBucket: 'prof-sylve.appspot.com',
  messagingSenderId: '882149932244',
  appId: '1:882149932244:web:ac078e9770d126ef4e8f41',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
