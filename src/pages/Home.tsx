import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import { Panel } from '../components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AppContext, useFirebaseAuthentication } from '../context';

const { Title } = Typography;

export const uiConfig = {
  signInFlow: 'redirect',
  signInSuccessUrl: '/start',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export default function Home(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);

  useFirebaseAuthentication();

  useEffect(() => {
    if (user) {
      history.push('/start');
    }
  }, []);

  return (
    <Panel style={{ maxWidth: '500px' }}>
      <Title level={2}>COVID test registration</Title>
      <Title level={5}>Please log in with your Cognite account.</Title>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Panel>
  );
}
