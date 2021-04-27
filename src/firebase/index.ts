import firebase from 'firebase/app';
import 'firebase/firestore';
import { errorHandler } from '../shared';

const firebaseConfig = {
  apiKey: 'AIzaSyArHLsiOxDy3Mgtr012VlBLKQ8dcaKtRmo',
  authDomain: 'covid-project-a32a4.firebaseapp.com',
  databaseURL: 'https://covid-project-a32a4.europe-west1.firebasedatabase.app',
  projectId: 'covid-project-a32a4',
  storageBucket: 'covid-project-a32a4.appspot.com',
  messagingSenderId: '1044325618990',
  appId: '1:1044325618990:web:a44eaedcc2ae1a12fd56bf',
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    errorHandler;
  }
} else {
  try {
    firebase.app();
  } catch (error) {
    errorHandler;
  }
}

export const db = firebase.firestore();

export * from './utils';
export default firebase;
