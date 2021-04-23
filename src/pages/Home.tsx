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
    <Panel style={{ maxWidth: '500px' }}>
      <Title level={2}>COVID test rejestration</Title>
      <Title level={4} style={{ margin: 0 }}>
        <a
          href="https://docs.google.com/document/d/1e7H0yW2TqpwzqHT0znAUwlzUN5OS940MesE1o6uiwfI"
          target="_blank"
          rel="noreferrer">
          Guidelines
        </a>
      </Title>
      <ul>
        <li>
          It is important that you do not enter Cognite&apos;s office (the 4th
          and 5th floor) until after you have been tested in Grand Hall. (1st
          floor).
        </li>
        <li>You should not come in earlier than your test appointment.</li>
        <li>
          If you have any reason / need to work from the office, please reach
          out to your people manager, and your manager will reach out to Hanne
          Natvik and Madeleine.
        </li>
        <li>
          These tests still require employees to continue to take necessary
          precautions.
        </li>
        <li>
          Employees need to keep a 2 meter distance in the work space - and use
          every second desk.{' '}
        </li>
        <li>
          External visitors, consultants etc should be avoided / be approved by
          Hanne Natvik.
        </li>
      </ul>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Panel>
  );
}
