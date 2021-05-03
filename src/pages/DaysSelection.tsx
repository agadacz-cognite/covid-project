import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Spin, Popconfirm } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  AppContext,
  useActiveRegistration,
  useUsersRegistration,
  useIsUserAdmin,
  useBackIfNotLogged,
  useCanUserPreregister,
} from '../context';
import { removeUserRegistration } from '../firebase/utils';
import { sendEmail } from '../shared/helpers';
import { Flex, Card, Header } from '../components';

dayjs.extend(relativeTime);

const { Title } = Typography;

const StyledFlex = styled(Flex)`
  & > * {
    margin: 12px 0;
  }
`;
const PanelPending = styled(Flex)`
  padding: 8px 16px;
  margin-bottom: 16px;
  background-color: #f2efda;
`;
const PanelDone = styled(Flex)`
  padding: 8px 16px;
  margin-bottom: 16px;
  background-color: #e0edd8;
`;

export default function DaysSelection(): JSX.Element {
  const history = useHistory();
  const [remainingTime, setRemainingTime] = useState<string | undefined>();
  const {
    user,
    activeRegistration,
    usersRegistration,
    canPreregister,
    isUserAdmin,
    setLoading,
  } = useContext(AppContext);

  useBackIfNotLogged();
  useIsUserAdmin();
  useActiveRegistration();
  useCanUserPreregister();
  useUsersRegistration(user?.email, activeRegistration?.id);

  const isUserRegistered =
    usersRegistration?.weekId &&
    usersRegistration?.weekId === activeRegistration?.id;

  const onAdminPageClick = () => history.push('/admin');
  const onProceed = () => {
    history.push('/choose');
  };
  const onDelete = async () => {
    const weekId = usersRegistration?.weekId;
    const email = usersRegistration?.email;
    if (isUserRegistered && weekId && email) {
      const week = `${new Date(
        (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
      ).toLocaleDateString()} - ${new Date(
        (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
      ).toLocaleDateString()}`;
      const userHours = Object.entries(usersRegistration?.testHours ?? {})
        .map((testHour: any) => {
          const week = activeRegistration?.slots.find(
            slot => slot.id === testHour[0],
          );
          return `${week?.testDay ?? '<unknown>'} - ${
            testHour?.[1] ?? '<unknown>'
          }`;
        })
        .join(', ');
      const userFirstName =
        usersRegistration?.name?.split(' ')?.[0] ?? 'Unknown Person';
      const subject = `💉 You have deleted your COVID test registration - week ${week}`;
      const content = `Hello ${userFirstName}! You just removed your apponitnment for the COVID test for the week ${week}. Removed testing dates: ${userHours}.`;
      setLoading(true);
      await removeUserRegistration(weekId, email);
      sendEmail({
        email: user.email,
        subject,
        content,
      });
      setLoading(false);
    }
  };

  const getUserFirstName = () => {
    if (user?.displayName) {
      const name = user.displayName.split(' ');
      return name[0];
    }
    return 'unknown entity';
  };

  const ifNoRegistration = (): JSX.Element | undefined => {
    if (!activeRegistration) {
      return (
        <p>
          There is no active registration at the moment! Please try again later.
        </p>
      );
    }
    return undefined;
  };

  const ifNotRegisteredYet = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (
      !isUserRegistered &&
      activeRegistration &&
      (registrationOpenTimestamp <= Number(new Date()) || canPreregister)
    ) {
      return (
        <StyledFlex column justify align>
          {canPreregister ? (
            <Flex
              row
              align
              justify
              style={{ backgroundColor: '#e6e7f7', padding: '8px 16px' }}>
              <InfoCircleOutlined />
              <Title level={5} style={{ margin: '0 0 0 8px', padding: 0 }}>
                You can preregister!
              </Title>
            </Flex>
          ) : (
            <Title level={4}>
              {new Date(
                (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
              ).toLocaleDateString()}
              -
              {new Date(
                (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
              ).toLocaleDateString()}
            </Title>
          )}
          <Title level={5}>You didn&apos;t register for this week yet.</Title>
        </StyledFlex>
      );
    }
  };

  const ifRegistrationOpen = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (
      activeRegistration &&
      (registrationOpenTimestamp <= Number(new Date()) || canPreregister)
    ) {
      return (
        <StyledFlex column justify align>
          <Button type="primary" onClick={onProceed} style={{ margin: '4px' }}>
            {isUserRegistered ? 'Change your choice' : 'Register'}
          </Button>
          {isUserRegistered && (
            <Popconfirm
              title={
                <>
                  <div>Are you sure you want to delete your registration?</div>
                  <div>
                    You will be able to register again (if there are any slots
                    left).
                  </div>
                </>
              }
              onConfirm={onDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelButtonProps={{ type: 'primary' }}
              cancelText="Nope :c"
              placement="right">
              <Button type="primary" danger style={{ margin: '4px' }}>
                Delete your registration
              </Button>
            </Popconfirm>
          )}
        </StyledFlex>
      );
    }
    return undefined;
  };

  const ifRegistrationPending = (): JSX.Element | undefined => {
    setInterval(() => {
      const registrationSeconds =
        activeRegistration?.registrationOpenTime?.seconds ?? 0;
      if (!registrationSeconds) {
        return;
      }
      const dateOfRegistrationOpen = dayjs.unix(registrationSeconds);
      const remaining =
        dayjs().to(dateOfRegistrationOpen) ?? 'I dont know when';
      setRemainingTime(remaining);
    }, 1000);

    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;

    if (activeRegistration && registrationOpenTimestamp > Number(new Date())) {
      return (
        <PanelPending column align justify>
          <Title level={4} style={{ margin: '4px' }}>
            Registration opens:
          </Title>
          <Title level={3} style={{ margin: '4px' }}>
            {remainingTime ?? '-'}
          </Title>
          <Title level={5} style={{ margin: '4px' }}>
            ({new Date(registrationOpenTimestamp).toLocaleString()})
          </Title>
        </PanelPending>
      );
    }
    return undefined;
  };

  const ifAlreadyRegistered = (): JSX.Element | undefined => {
    if (isUserRegistered) {
      return (
        <PanelDone column align justify>
          <Title level={4}>
            {new Date(
              (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
            ).toLocaleDateString()}{' '}
            -{' '}
            {new Date(
              (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
            ).toLocaleDateString()}
          </Title>
          {Object.entries(usersRegistration?.testHours ?? {}).map(
            (testHour: any, index: number) => {
              const week = activeRegistration?.slots.find(
                slot => slot.id === testHour[0],
              );
              return (
                <Flex column align justify key={`your-slot-${index}`}>
                  <Title level={5}>
                    {week?.testDay ?? '<unknown>'} -{' '}
                    {testHour?.[1] ?? '<unknown>'}
                  </Title>
                </Flex>
              );
            },
          )}
        </PanelDone>
      );
    }
  };

  console.log(isUserAdmin);

  if (!user) {
    return <Spin size="large" />;
  }
  return (
    <Flex column style={{ margin: 'auto' }}>
      <Header>
        <Title level={2} style={{ marginBottom: '4px' }}>
          Hello, {getUserFirstName()}!
        </Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        <Flex column>
          {isUserAdmin && (
            <Card style={{ width: 'auto', height: 'auto', margin: '8px' }}>
              <Flex row align justify>
                <Button type="primary" danger onClick={onAdminPageClick}>
                  Go to Admin page
                </Button>
              </Flex>
            </Card>
          )}
          <Card
            title="Your current selection"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex column align justify>
              {ifRegistrationPending()}
              {ifAlreadyRegistered()}
              {ifNotRegisteredYet()}
              {ifNoRegistration()}
              {ifRegistrationOpen()}
            </Flex>
          </Card>
          <Card style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <div>In case of technical problems with the application,</div>
            <div>
              {' '}
              please{' '}
              <a href="mailto:anna.gadacz@cognite.com?subject=COVID Project issue, fix fast pls">
                contact Anna
              </a>
              .
            </div>
          </Card>
        </Flex>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              <a
                href="https://docs.google.com/document/d/1e7H0yW2TqpwzqHT0znAUwlzUN5OS940MesE1o6uiwfI"
                target="_blank"
                rel="noreferrer">
                Guidelines
              </a>
            </Title>
          }
          style={{ maxWidth: '400px', margin: '8px' }}>
          <StyledFlex column justify align>
            <ul>
              <li>
                It is important that you do not enter Cognite&apos;s office (the
                4th and 5th floor) until after you have been tested in Grand
                Hall. (1st floor).
              </li>
              <li>
                You should not come in earlier than your test appointment.
              </li>
              <li>
                If you have any reason / need to work from the office, please
                reach out to your people manager, and your manager will reach
                out to Hanne Natvik and Madeleine.
              </li>
              <li>
                These tests still require employees to continue to take
                necessary precautions.
              </li>
              <li>
                Employees need to keep a 2 meter distance in the work space -
                and use every second desk.{' '}
              </li>
              <li>
                External visitors, consultants etc should be avoided / be
                approved by Hanne Natvik.
              </li>
            </ul>
          </StyledFlex>
        </Card>
      </Flex>
    </Flex>
  );
}
