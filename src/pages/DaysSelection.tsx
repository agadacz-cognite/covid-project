import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Card, Button, Typography, Spin, notification } from 'antd';
import styled from 'styled-components';
import {
  AppContext,
  useFirebaseAuthentication,
  useActiveRegistration,
} from '../context';
import { Flex } from '../components';

const { Title } = Typography;

const StyledFlex = styled(Flex)`
  & > * {
    margin: 12px 0;
  }
`;
const BigText = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

export default function DaysSelection(): JSX.Element {
  const history = useHistory();
  const { user, setDays } = useContext(AppContext);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);
  const activeRegistration = useActiveRegistration();

  console.log(activeRegistration);

  useFirebaseAuthentication();

  const isAdmin = true;

  const onFirstHalfChecked = (event: any) =>
    setFirstHalfChecked(event.target.checked);
  const onSecondHalfChecked = (event: any) =>
    setSecondHalfChecked(event.target.checked);
  const onAdminPageClick = () => history.push('/admin');
  const onProceed = () => {
    if (firstHalfChecked || secondHalfChecked) {
      setDays({ firstHalf: firstHalfChecked, secondHalf: secondHalfChecked });
      history.push('/choose');
    } else {
      notification.warning({
        message: 'Forgot something?',
        description: 'You have to choose at least one option!',
      });
    }
  };

  const getUserFirstName = () => {
    if (user?.displayName) {
      const name = user.displayName.split(' ');
      return name[0];
    }
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
  const ifRegistrationOpen = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (activeRegistration && registrationOpenTimestamp <= Number(new Date())) {
      return (
        <StyledFlex column justify align>
          <Checkbox checked={firstHalfChecked} onChange={onFirstHalfChecked}>
            <BigText>Monday, Tuesday, Wednesday</BigText>
          </Checkbox>
          <Checkbox checked={secondHalfChecked} onChange={onSecondHalfChecked}>
            <BigText>Thursday, Friday</BigText>
          </Checkbox>
          <Button type="primary" onClick={onProceed}>
            Next
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
        <Flex column align justify>
          <Title level={4}>Registration opens at:</Title>
          <Title level={3}>
            {new Date(registrationOpenTimestamp).toLocaleString()}
          </Title>
        </Flex>
      );
    }
    return undefined;
  };

  if (!user) {
    return <Spin size="large" />;
  }
  return (
    <Flex row align justify style={{ flexWrap: 'wrap' }}>
      <Flex column>
        <Card
          title="Which days of the week you want to go to the office?"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          {ifNoRegistration()}
          {ifRegistrationPending()}
          {ifRegistrationOpen()}
        </Card>
        {isAdmin && (
          <Card
            title={`Hello ${getUserFirstName()}! You're an admin.`}
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex row align justify>
              <Button type="primary" danger onClick={onAdminPageClick}>
                Go to Admin page
              </Button>
            </Flex>
          </Card>
        )}
      </Flex>
      <Card
        title={`Hello ${getUserFirstName()}!`}
        style={{ maxWidth: '400px', margin: '8px' }}>
        <StyledFlex column justify align>
          <Title level={4} style={{ margin: 0 }}>
            <a
              href="https://docs.google.com/document/d/1e7H0yW2TqpwzqHT0znAUwlzUN5OS940MesE1o6uiwfI"
              target="_blank"
              rel="noreferrer">
              Guidelines
            </a>
          </Title>
          <ul>
            <li>
              It is important that you do not enter Cognite&apos;s office (the
              4th and 5th floor) until after you have been tested in Grand Hall.
              (1st floor).
            </li>
            <li>You should not come in earlier than your test appointment.</li>
            <li>
              If you have any reason / need to work from the office, please
              reach out to your people manager, and your manager will reach out
              to Hanne Natvik and Madeleine.
            </li>
            <li>
              These tests still require employees to continue to take necessary
              precautions.
            </li>
            <li>
              Employees need to keep a 2 meter distance in the work space - and
              use every second desk.{' '}
            </li>
            <li>
              External visitors, consultants etc should be avoided / be approved
              by Hanne Natvik.
            </li>
          </ul>
        </StyledFlex>
      </Card>
    </Flex>
  );
}
