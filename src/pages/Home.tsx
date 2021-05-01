import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import { Panel } from '../components';
import { AppContext } from '../context';

const { Title } = Typography;

export default function Home(): JSX.Element {
  const history = useHistory();
  const { user, setUser, gapiLoaded } = useContext(AppContext);

  const GOOGLE_BUTTON_ID = 'google-sign-in-button';

  useEffect(() => {
    if (user) {
      history.push('/start');
    }
  }, [user]);

  useEffect(() => {
    if (gapiLoaded) {
      (window as any).gapi.signin2.render(GOOGLE_BUTTON_ID, {
        scope: 'https://www.googleapis.com/auth/plus.login',
        width: 220,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: onSignIn,
      });
    }
  }, [gapiLoaded]);

  const onSignIn = (googleUser: any) => {
    const profile = googleUser.getBasicProfile();
    const loggedInUser = {
      displayName: profile.getName(),
      email: profile.getEmail(),
    };
    setUser(loggedInUser);
  };

  return (
    <Panel style={{ maxWidth: '500px' }}>
      <Title level={2}>COVID test registration</Title>
      <Title level={5}>Please log in with your Cognite account.</Title>
      <div id={GOOGLE_BUTTON_ID}></div>
      <p style={{ color: '#aaa' }}>
        If anything goes wrong, please{' '}
        <a href="mailto:anna.gadacz@cognite.com?subject=COVID Project issue, fix fast pls">
          inform Anna
        </a>
        !
      </p>
    </Panel>
  );
}
