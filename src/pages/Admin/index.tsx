import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, Select } from 'antd';
import { ExportOutlined, WarningOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useActiveRegistration,
  useBackIfNotAdmin,
  useBackIfNotLogged,
} from '../../context';
import { getRegistrationsForThisWeek } from './utils';

const { Title } = Typography;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const { user, activeRegistration } = useContext(AppContext);
  const [preregistrationEmails, setPreregistrationEmails] = useState<
    string[]
  >();

  useActiveRegistration();
  useBackIfNotAdmin();
  useBackIfNotLogged();

  const onDownloadRegisteredUsers = async () => {
    const {
      final: registrations,
      weekDate,
    } = await getRegistrationsForThisWeek(activeRegistration);
    const fileTitle = weekDate.replace(' ', '');
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(registrations);
    XLSX.utils.book_append_sheet(workbook, sheet, 'data');
    XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
  };
  const onPreregistrationEmailsChange = (value: any) =>
    setPreregistrationEmails(value);
  const onPreregistrationEmailsSave = () => alert('Under development!');
  const onCreateNewRegistration = () => history.push('/admin/newweek');
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
                    (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
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
              onClick={onDownloadRegisteredUsers}
              disabled={!activeRegistration}>
              Export to Excel (*.xlsx) <ExportOutlined />
            </Button>
          </Flex>
        </Card>
        <Flex column>
          <Card
            title="Who can preregister?"
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>You can paste a list of emails here separated with a comma.</p>
            <Flex row align>
              <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                Emails
              </span>
              <Select
                value={preregistrationEmails}
                onChange={onPreregistrationEmailsChange}
                mode="tags"
                tokenSeparators={[',']}
                style={{ width: '100%', marginLeft: '8px' }}
              />
            </Flex>
            <Flex
              row
              align
              style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button type="primary" onClick={onPreregistrationEmailsSave}>
                Save
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
                Start new registration
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Flex>
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button
          type="default"
          size="large"
          style={{ boxShadow: '0 0 20px #000' }}
          onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
