import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, Select, Popconfirm, notification } from 'antd';
import { ExportOutlined, EditOutlined } from '@ant-design/icons';
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
    const {
      final: registrations,
      weekDate,
      legacy,
    } = await getRegistrationsForExcel(activeRegistration?.id);

    if (legacy) {
      notification.warning({
        message: 'Cannot download this week',
        description:
          'The week you try to download uses the legacy format and cannot be downloaded.',
      });
      return;
    }
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
  const onEditActiveRegistration = () =>
    history.push(`/admin/editweek/${activeRegistration?.id}`);
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
                <>
                  <Title level={5}>
                    There is no open registration at the moment!
                  </Title>
                  <Button danger onClick={onCreateNewRegistration}>
                    Start new registration
                  </Button>
                </>
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
              {activeRegistration && (
                <>
                  <Button
                    onClick={onEditActiveRegistration}
                    icon={<EditOutlined />}
                    style={{ marginBottom: '8px' }}>
                    Edit
                  </Button>
                  <Button
                    onClick={onPreviewRegisteredUsers}
                    style={{ marginBottom: '8px' }}>
                    View registered users
                  </Button>
                  <Button
                    onClick={onDownloadRegisteredUsers}
                    style={{ marginBottom: '8px' }}>
                    Export to Excel (*.xlsx) <ExportOutlined />
                  </Button>
                  <Popconfirm
                    title={
                      <>
                        <div>
                          Are you sure you want to close the active
                          registration?
                        </div>
                        <div>
                          You won&apos;t be able to reopen it and people
                          won&apos;t be able to register for this week anymore.
                        </div>
                        <div>
                          You can still view and export the list of all
                          registered users by clicking &quot;See old
                          registrations&quot; button below.
                        </div>
                      </>
                    }
                    onConfirm={onActiveRegistrationClose}
                    okText="Close"
                    okButtonProps={{ danger: true }}
                    cancelButtonProps={{ type: 'primary' }}
                    cancelText="Nope :c"
                    placement="top">
                    <Button danger>Close current registration</Button>
                  </Popconfirm>{' '}
                </>
              )}
            </Flex>
          </Card>
          <Card style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex row align justify>
              <Button onClick={onSeeOldRegistrations}>
                See old registrations
              </Button>
            </Flex>
          </Card>
        </Flex>
        <Flex column style={{ height: '100%' }}>
          <Card
            title="Who can preregister?"
            style={{ margin: '8px', maxWidth: '600px' }}>
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
              <Button
                type="primary"
                ghost
                onClick={onPreregistrationEmailsSave}>
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
