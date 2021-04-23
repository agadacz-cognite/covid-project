import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Input, Button, Tooltip, notification } from 'antd';
import { AppContext } from '../../context';
import { Flex } from '../../components';
import { Choice, Hour, Places } from './components';

import mock from './mock';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const { user, days } = useContext(AppContext);
  const [chosenFirstHalfHour, setChosenFirstHalfHour] = useState();
  const [chosenSecondHalfHour, setChosenSecondHalfHour] = useState();
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    if (!days) {
      history.push('/start');
    }
    if (!user) {
      history.push('/');
    }
  }, []);

  const isChosen = (hour: any, weekHalf: 'first' | 'second') => {
    if (weekHalf === 'first') {
      return hour.hour === chosenFirstHalfHour;
    }
    if (weekHalf === 'second') {
      return hour.hour === chosenSecondHalfHour;
    }
    return false;
  };

  const mapHours = (weekHalf: 'first' | 'second') =>
    mock[weekHalf].map((hour: any) => {
      const available = hour.availability > 0;
      const percentOfPlacesTaken = (hour.availability / hour.places) * 100;
      return (
        <Tooltip
          key={JSON.stringify(hour)}
          title={
            !available && 'All of the slots for this hour are already taken.'
          }>
          <Choice
            availability={percentOfPlacesTaken}
            chosen={isChosen(hour, weekHalf)}
            onClick={() => onHourChoose(hour, weekHalf, available)}>
            <Hour available={available}>{hour.hour}</Hour>
            <Places>
              <span style={{ fontWeight: 'bold' }}>{hour.availability}</span>{' '}
              available
            </Places>
          </Choice>
        </Tooltip>
      );
    });

  const onHourChoose = (
    hour: any,
    weekHalf: 'first' | 'second',
    available: boolean,
  ) => {
    if (!available) {
      return;
    }
    if (weekHalf === 'first') {
      setChosenFirstHalfHour(hour.hour);
    }
    if (weekHalf === 'second') {
      setChosenSecondHalfHour(hour.hour);
    }
  };

  const onManagerNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setManagerName(event.target.value);

  const onSubmit = () => {
    if (
      (days.firstHalf && !chosenFirstHalfHour) ||
      (days.secondHalf && !chosenSecondHalfHour)
    ) {
      notification.warning({
        message: 'Hour not specified',
        description: 'You have to choose an hour.',
      });
      return;
    }
    if (!managerName?.length) {
      notification.warning({
        message: 'Manager not specified',
        description: 'You have to share your manager name.',
      });
      return;
    }
    const registeredUser = {
      email: user.email,
      manager: managerName,
      testHours: [chosenFirstHalfHour, chosenSecondHalfHour],
    };
    alert(`This will be added soon: ${!!registeredUser}!`);
  };

  return (
    <Flex column>
      <Flex row>
        {days.firstHalf && (
          <Card
            title={
              <Flex align justify>
                Available test hours on Monday
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>
              After taking a COVID test during one of possible dates below, you
              can go to the office at Monday, Tuesday and Wednesday.
            </p>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              {mapHours('first')}
            </Flex>
          </Card>
        )}
        {days.secondHalf && (
          <Card
            title={
              <Flex align justify>
                Available test hours on Thursday
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>
              After taking a COVID test during one of possible dates below, you
              can go to the office at Thursday and Friday.
            </p>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              {mapHours('second')}
            </Flex>
          </Card>
        )}
      </Flex>
      <Flex
        column
        style={{ margin: '8px', padding: '8px', backgroundColor: 'white' }}>
        <Input
          placeholder="Your manager's name and surname here..."
          value={managerName}
          onChange={onManagerNameChange}
        />
        <Button type="primary" onClick={onSubmit} style={{ marginTop: '8px' }}>
          Submit
        </Button>
      </Flex>
    </Flex>
  );
}
