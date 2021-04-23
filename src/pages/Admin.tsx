import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { Panel } from '../components';
import { AppContext } from '../context';

const { Title } = Typography;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, []);

  const onCreateNewRegistration = () => alert('create');
  const onDownloadRegisteredUsers = () => alert('download?');

  return (
    <Panel>
      <Title level={2}>Admin page</Title>
      <Title level={4} style={{ margin: 0 }}>
        Active registration:
      </Title>
      <Button type="primary" onClick={onCreateNewRegistration}>
        Create new registration
      </Button>
      <Button type="primary" onClick={onDownloadRegisteredUsers}>
        Download registered users for the active rejestration
      </Button>
    </Panel>
  );
}
