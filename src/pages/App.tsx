import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Typography } from 'antd';
import Home from './Home';
import NotFound from './NotFound';
import Admin from './Admin';
import NewRegistration from './Admin/NewRegistration';
import DaysSelection from './DaysSelection';
import HourSelection from './HourSelection';
import { MainWrapper } from '../components';
import { AppContext } from '../context';

import 'antd/dist/antd.css';

const { Title } = Typography;

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
