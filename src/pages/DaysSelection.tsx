import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Spin } from 'antd';
import styled from 'styled-components';
import {
  AppContext,
  useFirebaseAuthentication,
  useActiveRegistration,
  useUsersRegistration,
  useIsUserAdmin,
} from '../context';
import { Flex, Card, Header } from '../components';

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
  const { user, activeRegistration, usersRegistration } = useContext(
    AppContext,
  );
  const isAdmin = useIsUserAdmin();

  useFirebaseAuthentication();
  useActiveRegistration();
  useUsersRegistration(user?.email, activeRegistration?.id);

  const isUserRegistered =
    usersRegistration?.weekId &&
    usersRegistration?.weekId === activeRegistration?.id;

  const onAdminPageClick = () => history.push('/admin');
  const onProceed = () => {
    history.push('/choose');
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
      registrationOpenTimestamp <= Number(new Date())
    ) {
      return (
        <Title level={5}>You didn&apos;t register for this week yet!</Title>
      );
    }
  };

  const ifRegistrationOpen = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (activeRegistration && registrationOpenTimestamp <= Number(new Date())) {
      return (
        <StyledFlex column justify align>
          <Button type="primary" onClick={onProceed}>
            {isUserRegistered ? 'Change your choice' : 'Register'}
          </Button>
        </StyledFlex>
      );
    }
    return undefined;
  };

  const ifRegistrationPending = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (activeRegistration && registrationOpenTimestamp > Number(new Date())) {
      return (
        <PanelPending column align justify>
          <Title level={4} style={{ margin: '4px' }}>
            Registration opens at:
          </Title>
          <Title level={3} style={{ margin: '4px' }}>
            {new Date(registrationOpenTimestamp).toLocaleString()}
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
          {isAdmin && (
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
