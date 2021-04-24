import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Typography, Button, Card, notification } from 'antd';
import styled from 'styled-components';
import { Flex, Header } from '../../components';
import { AppContext, useFirebaseAuthentication } from '../../context';
import { createActiveRegistration } from '../../firebase';

const { Title } = Typography;

const CustomInput = styled.input`
  border: none;
  background-color: #95abde;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
`;

export default function NewRegistration(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const [weekStartDate, setWeekStartDate] = useState<Date | undefined>(
    new Date(),
  );
  const [weekEndDate, setWeekEndDate] = useState<Date | undefined>();
  const [registrationOpenTime, setRegistrationOpenTime] = useState<Date>(
    new Date(),
  );

  const randomFarAwayDate = new Date(1934832714000);

  useFirebaseAuthentication();

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, []);

  const onCreateNewRegistration = () => {
    if (!weekStartDate || !weekEndDate) {
      notification.warning({
        message: 'Incomplete data',
        description:
          'You must provide the starting and ending date of the week, for which this registration will be valid!',
      });
      return;
    }
    if (!registrationOpenTime) {
      notification.warning({
        message: 'Incomplete data',
        description:
          'You must provide the time when people can start registering for this week!',
      });
      return;
    }
    const dates: any[] = [];
    const week = [weekStartDate, weekEndDate];
    const registrationData = { week, registrationOpenTime, dates };
    if (weekStartDate && weekEndDate && registrationOpenTime) {
      createActiveRegistration(registrationData);
    }
  };
  const onWeekChange = (dates: Date[]) => {
    const [weekStart, weekEnd] = dates;
    setWeekStartDate(weekStart);
    setWeekEndDate(weekEnd);
  };
  const onStartDateChange = (newStartDate: Date) => {
    setRegistrationOpenTime(newStartDate);
  };
  const onBack = () => history.push('/admin');

  return (
    <Flex column>
      <Header>
        <Title level={2}>New registration</Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row>
        <Card
          title="Select the week of the registration"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <DatePicker
            selected={weekStartDate}
            // @ts-ignore
            onChange={onWeekChange}
            startDate={weekStartDate}
            endDate={weekEndDate}
            minDate={new Date()}
            maxDate={randomFarAwayDate}
            selectsRange
            inline
          />
        </Card>
        <Flex column>
          <Card
            title="Select time when registration opens"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <DatePicker
              selected={registrationOpenTime}
              onChange={onStartDateChange}
              minDate={new Date()}
              maxDate={randomFarAwayDate}
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<CustomInput />}
              showTimeSelect
            />
          </Card>
          <Card
            title="Add slots for testing"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            :3c
          </Card>
        </Flex>
      </Flex>
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button type="default" onClick={onBack} style={{ marginRight: '8px' }}>
          Back to admin panel
        </Button>
        <Button type="primary" onClick={onCreateNewRegistration}>
          Open new week!
        </Button>
      </Flex>
    </Flex>
  );
}
