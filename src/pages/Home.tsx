import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import { Panel } from '../components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AppContext } from '../context';

const { Title } = Typography;

export const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/start',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export default function Home(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      history.push('/start');
    }
  }, []);

  return (
    <Panel>
      <Title level={2}>COVID test rejestration</Title>
      <Title level={4} style={{ margin: 0 }}>
        <a
          href="https://docs.google.com/document/d/1e7H0yW2TqpwzqHT0znAUwlzUN5OS940MesE1o6uiwfI/edit"
          target="_blank"
          rel="noreferrer">
          Guidelines
        </a>
      </Title>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Panel>
  );
}
