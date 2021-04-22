import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from 'firebase';
import { Typography } from 'antd';
import Home from '../Home';
import DaysSelection from '../DaysSelection';
import HourSelection from '../HourSelection';
import { MainWrapper } from '../../components';
import { AppContext } from '../../context';

import 'antd/dist/antd.css';

const { Title } = Typography;

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

export default function App(): JSX.Element {
  const { user } = useContext(AppContext);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      const isCogniter =
        !user.email.endsWith('@cognite.com') ||
        !user.email.endsWith('@cognitedata.com') ||
        !user.email.endsWith('@cogniteapp.com');
      if (!isCogniter) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [user]);

  if (!authorized) {
    return (
      <MainWrapper>
        <Title level={1}>UNAUTHORIZED</Title>
      </MainWrapper>
    );
  }
  return (
    <MainWrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/start">
            <DaysSelection />
          </Route>
          <Route exact path="/choose">
            <HourSelection />
          </Route>
        </Switch>
      </Router>
    </MainWrapper>
  );
}
