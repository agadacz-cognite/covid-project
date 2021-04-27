import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../context';
import { Loader } from '../components';
import Home from './Home';
import NotFound from './NotFound';
import Admin from './Admin';
import NewRegistration from './Admin/NewRegistration';
import DaysSelection from './DaysSelection';
import HourSelection from './HourSelection';

import 'antd/dist/antd.css';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
`;

export default function App(): JSX.Element {
  const { loading, setGapiLoaded } = useContext(AppContext);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';

    script.onload = () => {
      (window as any).gapi.load('client', () => {
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Wrapper>
            <Loader loading={loading} />
            <Home />
          </Wrapper>
        </Route>
        <Route exact path="/start">
          <Wrapper>
            <Loader loading={loading} />
            <DaysSelection />
          </Wrapper>
        </Route>
        <Route exact path="/choose">
          <Wrapper>
            <Loader loading={loading} />
            <HourSelection />
          </Wrapper>
        </Route>
        <Route exact path="/admin">
          <Wrapper>
            <Loader loading={loading} />
            <Admin />
          </Wrapper>
        </Route>
        <Route exact path="/admin/newweek">
          <Wrapper>
            <Loader loading={loading} />
            <NewRegistration />
          </Wrapper>
        </Route>
        <Route>
          <Wrapper>
            <NotFound />
          </Wrapper>
        </Route>
      </Switch>
    </Router>
  );
}
