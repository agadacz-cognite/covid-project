import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContextProvider from '../../context';
import Home from '../Home';
import WeekSelection from '../WeekSelection';
import HourSelection from '../HourSelection';
import { MainWrapper } from '../../components';

import 'antd/dist/antd.css';

export default function App(): JSX.Element {
  return (
    <AppContextProvider>
      <MainWrapper>
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/start">
              <WeekSelection />
            </Route>
            <Route exact path="/choose">
              <HourSelection />
            </Route>
          </Switch>
        </Router>
      </MainWrapper>
    </AppContextProvider>
  );
}
