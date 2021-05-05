import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import { errorHandler } from '../shared';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: 'covid-project-a32a4.firebaseapp.com',
  databaseURL: 'https://covid-project-a32a4.europe-west1.firebasedatabase.app',
  projectId: 'covid-project-a32a4',
  storageBucket: 'covid-project-a32a4.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    errorHandler(error);
  }
} else {
  try {
    firebase.app();
  } catch (error) {
    errorHandler(error);
  }
}

export const db = firebase.firestore();

export * from './utils';
export default firebase;
