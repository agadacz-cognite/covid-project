import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Typography, Button } from 'antd';
import styled from 'styled-components';
import { Panel, Flex } from '../../components';
import { AppContext, useFirebaseAuthentication } from '../../context';
import { createActiveRegistration } from '../../firebase';

const { Title } = Typography;
const PanelGroup = styled(Flex)`
  padding: 8px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  & > * {
    margin: 12px 0;
  }
`;

export default function NewRegistration(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const [week, setWeek] = useState<Date[]>([]);
  const [registrationOpenTime, setRegistrationOpenTime] = useState<Date>(
    new Date(),
  );

  useFirebaseAuthentication();

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, []);

  const tileDisabled = ({ date }: { date: any }): boolean => {
    const dayOfTheWeek = new Date(date).getDay();
    if (dayOfTheWeek === 6 || dayOfTheWeek === 0) {
      return true;
    }
    return false;
  };

  const onCreateNewRegistration = () => {
    const dates: any[] = [];
    const registrationData = { week, registrationOpenTime, dates };
    createActiveRegistration(registrationData);
  };
  const onDateChange = (changedWeek: Date[]) => {
    setWeek(changedWeek);
  };
  const onStartDateChange = (newStartDate: Date) => {
    setRegistrationOpenTime(newStartDate);
  };

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
          <Calendar
            // @ts-ignore
            onChange={onDateChange}
            tileDisabled={tileDisabled}
            minDate={new Date()}
            selectRange={true}
            allowPartialRange={false}
          />
          <Button type="primary" onClick={onCreateNewRegistration}>
            Do eet
          </Button>
        </PanelGroup>
        <PanelGroup column justify align>
          <Title level={4} style={{ margin: 0 }}>
            Select the date when registration opens
          </Title>
          {/* @ts-ignore */}
          <Calendar onChange={onStartDateChange} minDate={new Date()} />
          <Button type="primary" onClick={onCreateNewRegistration}>
            Do eet
          </Button>
        </PanelGroup>
      </Flex>
    </Panel>
  );
}
