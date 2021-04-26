import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { ExportOutlined, WarningOutlined } from '@ant-design/icons';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useFirebaseAuthentication,
  useActiveRegistration,
  useBackIfNotAdmin,
} from '../../context';

const { Title } = Typography;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const { user, activeRegistration } = useContext(AppContext);

  useActiveRegistration();
  useFirebaseAuthentication();
  useBackIfNotAdmin();

  const onCreateNewRegistration = () => {
    history.push('/admin/newweek');
  };
  const onEditActiveRegistration = () =>
    alert('Editing active registration - coming soon!');
  const onDownloadRegisteredUsers = () =>
    alert('Exporting registration data - coming soon!');
  const onBack = () => history.push('/start');

  return (
    <Flex column style={{ margin: 'auto' }}>
      <Header>
        <Title level={2}>Admin page</Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        <Card
          title="Active registration"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <Flex column align justify>
            {!activeRegistration && (
              <Title level={5}>
                There is no open registration at the moment!
              </Title>
            )}
            {activeRegistration?.registrationOpenTime?.seconds && (
              <>
                <p>For the week:</p>
                <Title level={5} style={{ margin: '0 0 16px 0' }}>
                  {new Date(
                    activeRegistration?.week[0]?.seconds * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    activeRegistration?.week[1]?.seconds * 1000,
                  ).toLocaleDateString()}
                </Title>
                <p>Opens at:</p>
                <Title level={5} style={{ margin: '0 0 16px 0' }}>
                  {new Date(
                    activeRegistration.registrationOpenTime.seconds * 1000,
                  ).toLocaleString()}
                </Title>
              </>
            )}
            <Button
              type="primary"
              onClick={onEditActiveRegistration}
              disabled={!activeRegistration}
              style={{ marginBottom: '8px' }}>
              Edit
            </Button>
            <Button
              type="primary"
              onClick={onDownloadRegisteredUsers}
              disabled={!activeRegistration}>
              Export to Google Sheets <ExportOutlined />
            </Button>
          </Flex>
        </Card>
        <Card
          title="New registration"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <Flex column>
            <p>
              <WarningOutlined /> Creating new registration will close the old
              one
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
