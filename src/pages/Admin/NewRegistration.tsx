import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Typography, Button, notification } from 'antd';
import styled from 'styled-components';
import { Panel, Flex } from '../../components';
import { AppContext, useFirebaseAuthentication } from '../../context';
import { createActiveRegistration } from '../../firebase';

const { Title } = Typography;
const PanelGroup = styled(Flex)`
  padding: 16px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  & > * {
    margin: 12px 0;
  }
`;
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
    <Panel>
      <Title level={2}>New registration</Title>
      <p style={{ margin: 0, color: '#aaa' }}>
        Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
      </p>
      <Flex row>
        <PanelGroup column justify align>
          <Title level={4} style={{ margin: 0 }}>
            Select the week of the registration
          </Title>
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
        </PanelGroup>
        <Flex column>
          <PanelGroup column justify align>
            <Title level={4} style={{ margin: 0 }}>
              Select the date when registration opens
            </Title>
            <DatePicker
              selected={registrationOpenTime}
              onChange={onStartDateChange}
              minDate={new Date()}
              maxDate={randomFarAwayDate}
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<CustomInput />}
              showTimeSelect
            />
          </PanelGroup>
        </Flex>
      </Flex>
      <Flex row>
        <Button type="default" onClick={onBack} style={{ marginRight: '8px' }}>
          Back to admin panel
        </Button>
        <Button type="primary" onClick={onCreateNewRegistration}>
          Open new week!
        </Button>
      </Flex>
    </Panel>
  );
}
