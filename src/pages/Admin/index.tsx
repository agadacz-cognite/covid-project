import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Panel, Flex } from '../../components';
import { AppContext, useFirebaseAuthentication } from '../../context';

const { Title } = Typography;

const PanelGroup = styled(Flex)`
  div {
    margin: 0 8px;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;

    & > * {
      margin-bottom: 8px;
    }
  }
`;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);

  useFirebaseAuthentication();

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

  return (
    <Panel>
      <Title level={2}>Admin page</Title>
      <p style={{ margin: 0, color: '#aaa' }}>
        Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
      </p>
      <PanelGroup row>
        <Flex column justify align>
          <Title level={4} style={{ margin: 0 }}>
            Active registration
          </Title>
          <Title level={5} style={{ margin: '0 0 16px 0' }}>
            {new Date().toLocaleString()}
          </Title>
          <Button type="primary" onClick={onEditActiveRegistration}>
            Edit
          </Button>
          <Button type="primary" onClick={onDownloadRegisteredUsers}>
            Export to Google Sheets <ExportOutlined />
          </Button>
        </Flex>
        <Flex column justify align>
          <Title level={4} style={{ margin: 0 }}>
            New registration
          </Title>
          <p>Creating new registration will close the old one</p>
          <Button type="primary" danger onClick={onCreateNewRegistration}>
            Create
          </Button>
        </Flex>
      </PanelGroup>
    </Panel>
  );
}
