import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import Home from './Home';
import NotFound from './NotFound';
import Admin from './Admin';
import NewRegistration from './Admin/NewRegistration';
import OldRegistrations from './Admin/OldRegistrations';
import EditRegistration from './Admin/EditRegistration';
import PreviewRegistration from './Admin/PreviewRegistration';
import DaysSelection from './DaysSelection';
import HourSelection from './HourSelection';
import { AppContext } from '../context';
import { Loader, LinksBar } from '../components';
import { isDev } from '../shared';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
`;

const Dev = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 24px;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 0 0 10px red;
  ::after {
    content: '--- DEV VERSION ---';
  }
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
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <Home />
          </Wrapper>
        </Route>
        <Route exact path="/start">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <DaysSelection />
          </Wrapper>
        </Route>
        <Route exact path="/choose">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <HourSelection />
          </Wrapper>
        </Route>
        <Route exact path="/admin">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <Admin />
          </Wrapper>
        </Route>
        <Route exact path="/admin/newweek">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <NewRegistration />
          </Wrapper>
        </Route>
        <Route exact path="/admin/editweek/:weekId">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <EditRegistration />
          </Wrapper>
        </Route>
        <Route exact path="/admin/oldweeks">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <OldRegistrations />
          </Wrapper>
        </Route>
        <Route exact path="/admin/preview/:weekId">
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <Loader $loading={loading} />
            <PreviewRegistration />
          </Wrapper>
        </Route>
        <Route>
          <Wrapper>
            {isDev && <Dev />}
            <LinksBar />
            <NotFound />
          </Wrapper>
        </Route>
      </Switch>
    </Router>
  );
}
