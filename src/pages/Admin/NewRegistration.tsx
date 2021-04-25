import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Typography, Button, Card, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Flex, Header } from '../../components';
import { AppContext, useFirebaseAuthentication } from '../../context';
import { createActiveRegistration } from '../../firebase';
import { SlotData } from '../../shared';
import Slot from './Slot';

const { Title } = Typography;

const defaultSlot: SlotData = {
  id: 'default',
  testDay: 'Monday',
  testHours: [
    '9:00',
    '9:20',
    '9:40',
    '10:00',
    '10:20',
    '10:40',
    '11:00',
    '11:20',
  ],
  slotsNr: 15,
  officeDays: ['Monday', 'Tuesday', 'Wednesday'],
};

export default function NewRegistration(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const [weekStartDate, setWeekStartDate] = useState<any | undefined>();
  const [weekEndDate, setWeekEndDate] = useState<any | undefined>();
  const [registrationOpenTime, setRegistrationOpenTime] = useState<any>(
    new Date(),
  );
  const [slots, setSlots] = useState<SlotData[]>([defaultSlot]);

  const randomFarAwayDate = new Date(1934832714000);

  useFirebaseAuthentication();

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, []);

  const isWeekday = (date: Date) => {
    if (date.getDay() === 6 || date.getDay() === 0) {
      return false;
    }
    return true;
  };

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
    if (!slots?.length) {
      notification.warning({
        message: 'Incomplete data',
        description: 'You must provide at least one slot for registration!',
      });
      return;
    }
    const week = [weekStartDate, weekEndDate];
    const registrationData = { week, registrationOpenTime, slots };
    if (weekStartDate && weekEndDate && registrationOpenTime && slots) {
      createActiveRegistration(registrationData);
      setTimeout(() => {
        history.push('/admin');
      }, 2000);
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
  const onAddSlot = () => {
    const newSlot: SlotData = {
      id: uuid(),
      testDay: 'Monday',
      testHours: ['9:00'],
      officeDays: ['Monday'],
      slotsNr: 15,
    };
    setSlots([...slots, newSlot]);
  };
  const onTestDayChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, testDay: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onTestHoursChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, testHours: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onOfficeDaysChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, officeDays: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onSlotsNrChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, slotsNr: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onSlotDelete = (id: string) => {
    const fixedSlots = slots.filter(slot => slot.id !== id);
    setSlots(fixedSlots);
  };
  const onBack = () => history.push('/admin');

  return (
    <Flex column style={{ maxWidth: '1024px' }}>
      <Header>
        <Title level={2} style={{ marginBottom: '4px' }}>
          Open registration for new week
        </Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row>
        <Flex column>
          <Card
            title="Select the week of the registration"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex column align justify>
              <p>
                Here you can choose for which week this registration will be
                valid.
              </p>
              <DatePicker
                selected={weekStartDate}
                // @ts-ignore
                onChange={onWeekChange}
                startDate={weekStartDate}
                endDate={weekEndDate}
                minDate={new Date()}
                maxDate={randomFarAwayDate}
                filterDate={isWeekday}
                locale="en-GB"
                selectsRange
                inline
              />
            </Flex>
          </Card>
          <Card
            title="Select time when people can start registering"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex column align justify>
              <p>
                Date selected here will be the time from which people can start
                registering for their preferred time slots. This is to ensure
                that everyone have a fair chance to get the slot they want.
              </p>
              <DatePicker
                selected={registrationOpenTime}
                onChange={onStartDateChange}
                minDate={new Date()}
                maxDate={randomFarAwayDate}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<CustomInput disabled />}
                locale="en-GB"
                showTimeSelect
                calendarContainer={({ children }) => (
                  <Flex
                    row
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid grey',
                    }}>
                    {children}
                  </Flex>
                )}
              />
            </Flex>
          </Card>
        </Flex>
        <Card
          title="Add slots for testing"
          style={{ width: 'auto', height: 'auto', margin: '8px' }}>
          <Flex column>
            <p>
              Here you can choose a day when testing is carried out, hours
              during which testing happens, and the days during which employee
              is eligible to come to the office after test.
            </p>
            {slots?.map((slot: SlotData, index: number) => (
              <Slot
                slot={slot}
                key={`slot-${index}`}
                onTestDayChange={onTestDayChange}
                onTestHoursChange={onTestHoursChange}
                onOfficeDaysChange={onOfficeDaysChange}
                onSlotsNrChange={onSlotsNrChange}
                onSlotDelete={onSlotDelete}
              />
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={onAddSlot}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </Flex>
        </Card>
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

const CustomInput = styled.input`
  border: none;
  background-color: #95abde;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
`;
