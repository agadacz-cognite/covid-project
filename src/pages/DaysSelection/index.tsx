import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Card, Button, notification } from 'antd';
import styled from 'styled-components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AppContext } from '../../context';
import { Flex } from '../../components';
import { uiConfig } from '../Home';

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
    <Card
      title={`Hello ${getUserFirstName()}! Which days of the week you want to go to the office?`}
      style={{ width: 'auto' }}>
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
    </Card>
  );
}
