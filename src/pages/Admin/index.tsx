import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, Select, Popconfirm, notification } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useActiveRegistration,
  useBackIfNotAdmin,
  useBackIfNotLogged,
  usePreviousWeeks,
  usePreregisteredEmails,
} from '../../context';
import {
  getRegistrationsForExcel,
  savePreregistrationEmails,
  closeActiveRegistration,
} from '../../shared';

const { Title } = Typography;

export default function Admin(): JSX.Element {
  const history = useHistory();
  const {
    user,
    activeRegistration,
    setLoading,
    preregistrationEmails,
  } = useContext(AppContext);
  const [
    currentPreregistrationEmails,
    setCurrentPreregistrationEmails,
  ] = useState<string[]>(preregistrationEmails ?? []);

  useActiveRegistration();
  useBackIfNotAdmin();
  useBackIfNotLogged();
  usePreregisteredEmails();
  usePreviousWeeks();

  useEffect(() => {
    setCurrentPreregistrationEmails(preregistrationEmails);
  }, [preregistrationEmails]);

  const onDownloadRegisteredUsers = async () => {
    const { final: registrations, weekDate } = await getRegistrationsForExcel(
      activeRegistration?.id,
    );
    const fileTitle = weekDate.replace(' ', '');
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(registrations);
    XLSX.utils.book_append_sheet(workbook, sheet, 'data');
    XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
  };
  const onPreregistrationEmailsChange = (value: any) =>
    setCurrentPreregistrationEmails(value);
  const onPreregistrationEmailsSave = async () => {
    if (currentPreregistrationEmails?.length) {
      setLoading(true);
      await savePreregistrationEmails(currentPreregistrationEmails);
      setLoading(false);
    } else {
      notification.warning({
        message: 'No emails set',
        description: 'You havent set any emails to preregister!',
      });
    }
  };
  const onActiveRegistrationClose = () => closeActiveRegistration();
  const onPreviewRegisteredUsers = () =>
    history.push(`/admin/preview/${activeRegistration?.id}`);
  const onCreateNewRegistration = () => history.push('/admin/newweek');
  const onSeeOldRegistrations = () => history.push('/admin/oldweeks');
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
        <Flex column style={{ height: '100%' }}>
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
                  <Flex align row style={{ marginBottom: '8px' }}>
                    <div>Week: </div>
                    <Title level={5} style={{ margin: '0 0 0 8px' }}>
                      {new Date(
                        (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
                      ).toLocaleDateString()}{' '}
                      -{' '}
                      {new Date(
                        (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
                      ).toLocaleDateString()}
                    </Title>
                  </Flex>
                  <Flex align row style={{ marginBottom: '8px' }}>
                    <div>Opens at:</div>
                    <Title level={5} style={{ margin: '0 0 0 8px' }}>
                      {new Date(
                        activeRegistration.registrationOpenTime.seconds * 1000,
                      ).toLocaleString()}
                    </Title>
                  </Flex>
                </>
              )}
              <Button
                type="primary"
                onClick={onPreviewRegisteredUsers}
                disabled={!activeRegistration}
                style={{ marginBottom: '8px' }}>
                View registered users
              </Button>
              <Button
                type="primary"
                onClick={onDownloadRegisteredUsers}
                disabled={!activeRegistration}
                style={{ marginBottom: '8px' }}>
                Export to Excel (*.xlsx) <ExportOutlined />
              </Button>
              <Popconfirm
                title={
                  <>
                    <div>
                      Are you sure you want to close the active registration?
                    </div>
                    <div>
                      You won&apos;t be able to reopen it and people won&apos;t
                      be able to register for this week anymore.
                    </div>
                    <div>
                      You can still view and export the list of all registered
                      users by clicking &quot;See old registrations&quot; button
                      below.
                    </div>
                  </>
                }
                onConfirm={onActiveRegistrationClose}
                okText="Close"
                okButtonProps={{ danger: true }}
                cancelButtonProps={{ type: 'primary' }}
                cancelText="Nope :c"
                placement="top">
                <Button type="primary" danger disabled={!activeRegistration}>
                  Close current registration
                </Button>
              </Popconfirm>
            </Flex>
          </Card>
          <Card style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex row align justify>
              <Button type="primary" onClick={onSeeOldRegistrations}>
                See old registrations
              </Button>
            </Flex>
          </Card>
        </Flex>
        <Flex column style={{ height: '100%' }}>
          <Card
            title="Who can preregister?"
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>
              People using those emails will be allowed to register instantly
              after the new registration is created, even if it&apos;s not
              officially open yet.
            </p>
            <p>You can paste a list of emails here separated with a comma.</p>
            <Flex row align>
              <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                Emails
              </span>
              <Select
                value={currentPreregistrationEmails}
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
        </Flex>
      </Flex>
      <Header style={{ flexDirection: 'row' }}>
        <Button
          type="primary"
          size="large"
          onClick={onBack}
          style={{ marginRight: '8px' }}>
          Back
        </Button>
        <Button
          type="primary"
          danger
          size="large"
          onClick={onCreateNewRegistration}>
          Start new registration
        </Button>
      </Header>
    </Flex>
  );
}
