import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Card, notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AppContext } from '../../context';
import { Flex } from '../../components';
import { uiConfig } from '../Home';

import spot from '../../shared/img/spot.jpg';

const StyledFlex = styled(Flex)`
  & > * {
    margin: 12px 0;
  }
`;
const BigText = styled.div`
  font-size: 14px;
  font-weight: bold;
`;
const Spot = styled.img`
  width: 200px;
`;
const StyledCard = styled(Card)`
  .ant-card-actions {
    background-color: #ddedd1;
  }
`;

export default function DaysSelection(): JSX.Element {
  const history = useHistory();
  const { user, setUser } = useContext(AppContext);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);

  firebase.auth().onAuthStateChanged(newUser => {
    if (newUser) {
      setUser(newUser);
    }
  });

  const onFirstHalfChecked = (event: any) =>
    setFirstHalfChecked(event.target.checked);
  const onSecondHalfChecked = (event: any) =>
    setSecondHalfChecked(event.target.checked);
  const onProceed = () => {
    if (firstHalfChecked || secondHalfChecked) {
      history.push('/choose');
    } else {
      notification.warning({
        message: '>:C',
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
      <StyledCard>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </StyledCard>
    );
  }
  return (
    <StyledCard
      title={`Hello ${getUserFirstName()}! Which days of the week you want to go to the office?`}
      cover={
        <Flex row align justify>
          <Spot src={spot} alt="spot" />
        </Flex>
      }
      actions={[<CheckCircleOutlined key="proceed" onClick={onProceed} />]}
      style={{ width: 'auto' }}>
      <StyledFlex column justify align>
        <Checkbox checked={firstHalfChecked} onChange={onFirstHalfChecked}>
          <BigText>Monday, Tuesday, Wednesday</BigText>
        </Checkbox>
        <Checkbox checked={secondHalfChecked} onChange={onSecondHalfChecked}>
          <BigText>Thursday, Friday</BigText>
        </Checkbox>
      </StyledFlex>
    </StyledCard>
  );
}
