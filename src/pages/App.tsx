import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import NotFound from './NotFound';
import Admin from './Admin';
import NewRegistration from './Admin/NewRegistration';
import DaysSelection from './DaysSelection';
import HourSelection from './HourSelection';
import { MainWrapper } from '../components';

import 'antd/dist/antd.css';

export default function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainWrapper>
            <Home />
          </MainWrapper>
        </Route>
        <Route exact path="/start">
          <MainWrapper>
            <DaysSelection />
          </MainWrapper>
        </Route>
        <Route exact path="/choose">
          <MainWrapper>
            <HourSelection />
          </MainWrapper>
        </Route>
        <Route exact path="/admin">
          <MainWrapper>
            <Admin />
          </MainWrapper>
        </Route>
        <Route exact path="/admin/newweek">
          <MainWrapper>
            <NewRegistration />
          </MainWrapper>
        </Route>
        <Route>
          <MainWrapper>
            <NotFound />
          </MainWrapper>
        </Route>
      </Switch>
    </Router>
  );
}
