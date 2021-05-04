import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { v4 as uuid } from 'uuid';
import { Typography, Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useBackIfNotAdmin,
  useBackIfNotLogged,
} from '../../context';
import { createActiveRegistration } from '../../firebase';
import { SlotData } from '../../shared';
import { defaultHour, defaultPlaces, defaultNewHour } from './utils';
import Slot from './Slot';

const { Title } = Typography;

const defaultSlot: SlotData = {
  id: uuid(),
  testDay: 'Monday',
  testHours: [{ hour: defaultHour, places: defaultPlaces, id: uuid() }],
  officeDays: ['Monday', 'Tuesday', 'Wednesday'],
};

export default function NewRegistration(): JSX.Element {
  const history = useHistory();
  const { user, setLoading } = useContext(AppContext);
  const [weekStartDate, setWeekStartDate] = useState<any | undefined>();
  const [weekEndDate, setWeekEndDate] = useState<any | undefined>();
  const [registrationOpenTime, setRegistrationOpenTime] = useState<any>(
    new Date(),
  );
  const [slots, setSlots] = useState<SlotData[]>([defaultSlot]);

  useBackIfNotLogged();
  useBackIfNotAdmin();

  const randomFarAwayDate = new Date(1934832714000);

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
    setLoading(true);
    const week = [weekStartDate, weekEndDate];
    const registrationData = { week, registrationOpenTime, slots, id: uuid() };
    if (weekStartDate && weekEndDate && registrationOpenTime && slots) {
      createActiveRegistration(registrationData);
      setTimeout(() => {
        history.push('/admin');
        setLoading(false);
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
      testHours: [defaultNewHour],
      officeDays: ['Monday'],
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
  const onSlotDelete = (id: string) => {
    const fixedSlots = slots.filter(slot => slot.id !== id);
    setSlots(fixedSlots);
  };

  const onBack = () => history.push('/admin');

  return (
    <Flex column style={{ maxWidth: '1024px', margin: 'auto' }}>
      <Header>
        <Title level={2} style={{ marginBottom: '4px' }}>
          Open registration for new week
        </Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        <Flex column>
          <Card
            title="Select the week of the registration"
            style={{ margin: '8px', maxWidth: '400px' }}>
            <Flex column align justify>
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
            style={{ margin: '8px', maxWidth: '400px' }}>
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
          style={{ margin: '8px', maxWidth: '500px' }}>
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
      <Header style={{ flexDirection: 'row' }}>
        <Button
          type="primary"
          size="large"
          onClick={onBack}
          style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Popconfirm
          title={
            <div>
              <div>Are you sure you want to start a new registration?</div>
              <div style={{ fontWeight: 'bold' }}>
                <WarningOutlined style={{ marginRight: '8px', color: 'red' }} />
                This will CLOSE the old one!
              </div>
            </div>
          }
          onConfirm={onCreateNewRegistration}
          okText="Do it"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: 'primary' }}
          cancelText="Nope :c"
          placement="top">
          <Button type="primary" size="large" danger>
            Open new registration
          </Button>
        </Popconfirm>
      </Header>
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
