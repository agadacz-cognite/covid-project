import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Tooltip, notification } from 'antd';
import {
  AppContext,
  useBackIfNotLogged,
  useActiveRegistration,
  useAvailablePlacesForSlots,
} from '../../context';
import { registerUserForTest } from '../../firebase';
import { FixedSlotData, SlotData } from '../../shared';
import { Flex, Card } from '../../components';
import { Choice, Hour, Places } from './components';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const { user, slotsData, activeRegistration } = useContext(AppContext);
  const [managerName, setManagerName] = useState('');
  const [chosenDays, setChosenDays] = useState<SlotData[]>([]);
  const [testHours, setTestHours] = useState<any>({});

  useBackIfNotLogged();
  useActiveRegistration();
  useAvailablePlacesForSlots(activeRegistration?.id);

  useEffect(() => {
    if (activeRegistration?.slots) {
      const slots: SlotData[] = activeRegistration?.slots;
      setChosenDays(slots);
    } else {
      history.push('/start');
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
    if (!managerName?.length) {
      notification.warning({
        message: 'Manager not specified',
        description: 'You have to share your manager name.',
      });
      return;
    }
    if (!activeRegistration?.id) {
      notification.warning({
        message: 'Something went wrong',
        description: 'We could not register you. Please try again later.',
      });
      return;
    }
    const registeredUser = {
      email: user.email,
      name: user.displayName,
      weekId: activeRegistration.id,
      manager: managerName,
      testHours,
    };
    registerUserForTest(registeredUser);
  };
  const onBack = () => history.push('/start');

  const mapHours = (id: string) => {
    const slotToMap = chosenDays.find((slot: SlotData) => slot.id === id);
    if (!slotToMap) {
      return 'no slots to map';
    }
    return slotToMap.testHours.map((hour: any) => {
      const slotData = slotsData.find(
        (fixedSlot: FixedSlotData) => fixedSlot.id === id,
      );
      if (!slotData) {
        return 'no slot data';
      }
      const fixedTestHour = slotData.testHours.find(
        (testHour: any) => testHour.time === hour,
      );
      if (!fixedTestHour) {
        return 'no fixed test houts';
      }
      const available = fixedTestHour.takenPlaces < fixedTestHour.totalPlaces;
      const percentOfPlacesTaken =
        (fixedTestHour.totalPlaces - fixedTestHour.takenPlaces) /
        fixedTestHour.totalPlaces;
      return (
        <Tooltip
          key={JSON.stringify(hour)}
          title={
            !available && 'All of the slots for this hour are already taken.'
          }>
          <Choice
            availability={percentOfPlacesTaken}
            chosen={isChosen(id, hour)}
            onClick={() => onHourChoose(id, hour, available)}>
            <Hour available={available}>{hour}</Hour>
            <Places>
              <span style={{ fontWeight: 'bold' }}>
                {fixedTestHour.totalPlaces - fixedTestHour.takenPlaces}
              </span>{' '}
              available
            </Places>
          </Choice>
        </Tooltip>
      );
    });
  };

  return (
    <Flex column style={{ margin: 'auto' }}>
      <Flex row style={{ flexWrap: 'wrap' }}>
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
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button type="default" onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
