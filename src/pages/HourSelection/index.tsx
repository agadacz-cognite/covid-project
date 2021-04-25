import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Input, Button, Tooltip, notification } from 'antd';
import {
  AppContext,
  useFirebaseAuthentication,
  useActiveRegistration,
} from '../../context';
import { SlotData } from '../../shared';
import { Flex } from '../../components';
import { Choice, Hour } from './components';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const { user, days } = useContext(AppContext);
  const [managerName, setManagerName] = useState('');
  const [chosenDays, setChosenDays] = useState<SlotData[]>([]);
  const [testHours, setTestHours] = useState<any>({});
  const activeRegistration = useActiveRegistration();

  useFirebaseAuthentication();

  useEffect(() => {
    if (days) {
      const slots: SlotData[] =
        activeRegistration?.slots.filter(slot => days.includes(slot.id)) ?? [];
      setChosenDays(slots);
    }
    if (!days) {
      history.push('/start');
    }
    if (!user) {
      history.push('/');
    }
  }, []);

  const isChosen = (id: string, hour: any) => testHours[id] === hour;

  const onHourChoose = (id: string, hour: any, available: boolean) => {
    if (!available) {
      return;
    }
    const fixedChosenSlots = {
      ...testHours,
      [id]: hour,
    };
    setTestHours(fixedChosenSlots);
  };
  const onManagerNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setManagerName(event.target.value);
  const onSubmit = () => {
    if (Object.values(testHours).length === 0) {
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
      testHours,
    };
    alert(`This will be added soon: ${!!registeredUser}!`);
  };

  const mapHours = (id: string) => {
    const slotToMap = chosenDays.find((slot: SlotData) => slot.id === id);
    if (!slotToMap) {
      return undefined;
    }
    return slotToMap.testHours.map((hour: any) => {
      const available = true;
      //   const available = hour.availability > 0;
      //   const percentOfPlacesTaken = (hour.availability / hour.places) * 100;
      return (
        <Tooltip
          key={JSON.stringify(hour)}
          title={
            !available && 'All of the slots for this hour are already taken.'
          }>
          <Choice
            availability={100}
            chosen={isChosen(id, hour)}
            onClick={() => onHourChoose(id, hour, available)}>
            <Hour available={available}>{hour}</Hour>
            {/* <Places>
               <span style={{ fontWeight: 'bold' }}>{hour.availability}</span>{' '}
               available
             </Places> */}
          </Choice>
        </Tooltip>
      );
    });
  };

  console.log(chosenDays);

  return (
    <Flex column>
      <Flex row>
        {chosenDays?.map((slot: SlotData, index: number) => (
          <Card
            key={`${slot.id}-${index}`}
            title={
              <Flex align justify>
                Available test hours on {slot.testDay}
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>
              After taking a COVID test at {slot.testDay} on one of slots below,
              you can go to the office at:
            </p>
            <ul>
              {slot.officeDays.map((day: string) => (
                <li key={`${slot.id}-${day}`}>{day}</li>
              ))}
            </ul>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              {mapHours(slot.id)}
            </Flex>
          </Card>
        ))}
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
