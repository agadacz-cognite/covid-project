import React, { useState, useContext } from 'react';
import { Card, Input, Button, notification } from 'antd';
import { AppContext } from '../../context';
import { Flex } from '../../components';
import { Choice, Hour, Places } from './components';

import mock from './mock';

export default function HourSelection(): JSX.Element {
  const { days } = useContext(AppContext);
  const [chosenFirstHalfHour, setChosenFirstHalfHour] = useState();
  const [chosenSecondHalfHour, setChosenSecondHalfHour] = useState();
  const [managerName, setManagerName] = useState('');

  const mapHours = (weekHalf: 'first' | 'second') =>
    mock[weekHalf].map((hour: any) => {
      const available = hour.availability > 0;
      const percentOfPlacesTaken = (hour.availability / hour.places) * 100;
      return (
        <Choice
          availability={percentOfPlacesTaken}
          onClick={() => onHourChoose(hour, weekHalf)}
          key={JSON.stringify(hour)}>
          <Hour available={available}>{hour.hour}</Hour>
          <Places available={available}>{hour.availability} available</Places>
        </Choice>
      );
    });

  const onHourChoose = (hour: any, weekHalf: 'first' | 'second') => {
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
    }
    if (!managerName?.length) {
      notification.warning({
        message: 'Manager not specified',
        description: 'You have to share your manager name.',
      });
    }
  };

  return (
    <Flex column>
      <Flex row>
        {days.firstHalf && (
          <Card
            title={
              <Flex align justify>
                Monday, Tuesday, Wednesday
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              {mapHours('first')}
            </Flex>
          </Card>
        )}
        {days.secondHalf && (
          <Card
            title={
              <Flex align justify>
                Thursday, Friday
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
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
