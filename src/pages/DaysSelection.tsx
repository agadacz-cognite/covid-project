import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Card, Button, Typography, notification } from 'antd';
import styled from 'styled-components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AppContext } from '../context';
import { Flex } from '../components';
import { uiConfig } from './Home';

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
  const { user, setUser, setDays } = useContext(AppContext);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);

  const isAdmin = true;

  firebase.auth().onAuthStateChanged(newUser => {
    if (newUser) {
      setUser(newUser);
    } else {
      history.push('/');
    }
  });

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

  if (!user) {
    return (
      <Card>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Card>
    );
  }
  return (
    <Flex row align justify style={{ flexWrap: 'wrap' }}>
      <Flex column>
        <Card
          title="Which days of the week you want to go to the office?"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <StyledFlex column justify align>
            <Checkbox checked={firstHalfChecked} onChange={onFirstHalfChecked}>
              <BigText>Monday, Tuesday, Wednesday</BigText>
            </Checkbox>
            <Checkbox
              checked={secondHalfChecked}
              onChange={onSecondHalfChecked}>
              <BigText>Thursday, Friday</BigText>
            </Checkbox>
            <Button type="primary" onClick={onProceed}>
              Next
            </Button>
          </StyledFlex>
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
