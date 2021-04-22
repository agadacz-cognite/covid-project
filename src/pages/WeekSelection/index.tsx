import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Card, notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex } from '../../components';

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

export default function WeekSelection(): JSX.Element {
  const history = useHistory();
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);

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

  return (
    <StyledCard
      title="Which days of the week you want to go to the office?"
      cover={
        <Flex row align justify>
          <Spot src={spot} alt="spot" />
        </Flex>
      }
      actions={[<CheckCircleOutlined key="proceed" onClick={onProceed} />]}
      style={{ width: 'auto' }}>
      <StyledFlex column justify align>
        <Checkbox value={firstHalfChecked} onChange={onFirstHalfChecked}>
          <BigText>Monday, Tuesday, Wednesday</BigText>
        </Checkbox>
        <Checkbox value={secondHalfChecked} onChange={onSecondHalfChecked}>
          <BigText>Thursday, Friday</BigText>
        </Checkbox>
      </StyledFlex>
    </StyledCard>
  );
}
