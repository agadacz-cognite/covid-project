import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Panel, Flex } from '../components';
import { AppContext, useFirebaseAuthentication } from '../context';
import { createActiveRegistration } from '../firebase';

const { Title } = Typography;

const PanelGroup = styled(Flex)`
  div {
    margin-right: 8px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
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
    const startsAt = Date.now();
    const dates: any[] = [];
    const registrationData = { startsAt, dates };
    createActiveRegistration(registrationData);
  };
  const onDownloadRegisteredUsers = () => alert('download?');

  return (
    <Panel>
      <Title level={2}>Admin page</Title>
      <PanelGroup row>
        <Flex column>
          <Title level={4} style={{ margin: 0 }}>
            Active registration:
          </Title>
          <Button type="primary" onClick={onCreateNewRegistration}>
            Create new registration
          </Button>
        </Flex>
        <Flex column style={{ flexGrow: 1, flexBasis: 0 }}>
          <Button type="primary" onClick={onDownloadRegisteredUsers}>
            Export active registration to Google Sheets <ExportOutlined />
          </Button>
        </Flex>
      </PanelGroup>
    </Panel>
  );
}
