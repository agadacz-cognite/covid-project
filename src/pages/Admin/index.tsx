import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, Card } from 'antd';
import { ExportOutlined, WarningOutlined } from '@ant-design/icons';
import { Flex, Header } from '../../components';
import {
  AppContext,
  useFirebaseAuthentication,
  useActiveRegistration,
} from '../../context';

const { Title } = Typography;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const activeRegistration = useActiveRegistration();

  useFirebaseAuthentication();

  console.log(activeRegistration);

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, []);

  const onCreateNewRegistration = () => {
    history.push('/admin/newweek');
  };
  const onEditActiveRegistration = () => alert('edit?');
  const onDownloadRegisteredUsers = () => alert('download?');
  const onBack = () => history.push('/start');

  return (
    <Flex column>
      <Header>
        <Title level={2}>Admin page</Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row>
        <Card
          title="Active registration"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <Flex column>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>
              {new Date().toLocaleString()}
            </Title>
            <Button
              type="primary"
              onClick={onEditActiveRegistration}
              style={{ marginBottom: '8px' }}>
              Edit
            </Button>
            <Button type="primary" onClick={onDownloadRegisteredUsers}>
              Export to Google Sheets <ExportOutlined />
            </Button>
          </Flex>
        </Card>
        <Card
          title="New registration"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <Flex column>
            <p>
              <WarningOutlined />
              Creating new registration will close the old one
            </p>
            <Button type="primary" danger onClick={onCreateNewRegistration}>
              Create
            </Button>
          </Flex>
        </Card>
      </Flex>
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button type="default" onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
