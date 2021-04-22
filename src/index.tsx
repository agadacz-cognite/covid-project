import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import AppContextProvider from './context';
import firebase from 'firebase';

import './index.css';

const firebaseConfig = {
  apiKey: 'AIzaSyArHLsiOxDy3Mgtr012VlBLKQ8dcaKtRmo',
  authDomain: 'covid-project-a32a4.firebaseapp.com',
  databaseURL:
    'https://covid-project-a32a4-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'covid-project-a32a4',
  storageBucket: 'covid-project-a32a4.appspot.com',
  messagingSenderId: '1044325618990',
  appId: '1:1044325618990:web:a44eaedcc2ae1a12fd56bf',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
