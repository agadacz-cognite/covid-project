import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Tooltip, Switch, Spin, notification } from 'antd';
import {
  AppContext,
  useBackIfNotLogged,
  useActiveRegistration,
  useAvailablePlacesForSlots,
} from '../../context';
import { registerUserForTest } from '../../firebase';
import { FixedSlotData, RegisteredUser, SlotData } from '../../shared';
import { Flex, Card } from '../../components';
import { Choice, Hour, Places } from './components';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const {
    user,
    slotsData,
    setLoading,
    usersRegistration,
    activeRegistration,
  } = useContext(AppContext);
  const [managerName, setManagerName] = useState('');
  const [chosenDays, setChosenDays] = useState<SlotData[]>([]);
  const [testHours, setTestHours] = useState<any>({});
  const [vaccinated, setVaccinated] = useState(false);

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

  useEffect(() => {
    if (usersRegistration) {
      setTestHours(usersRegistration.testHours);
      setVaccinated(usersRegistration.vaccinated);
      setManagerName(usersRegistration.manager);
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
  const onSubmit = async () => {
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
    if (!Object.keys(testHours)?.length) {
      notification.warning({
        message: 'Hours not specified',
        description: 'Choose at least one time slot.',
      });
      return;
    }
    const registeredUser = {
      email: user.email,
      name: user.displayName,
      weekId: activeRegistration.id,
      manager: managerName,
      vaccinated,
      registeredTimestamp: Date.now(),
      testHours,
    };
    setLoading(true);
    await registerUserForTest(registeredUser, slotsData);
    sendEmail(registeredUser);
    setLoading(false);
  };
  const onBack = () => history.push('/start');

  const sendEmail = (registeredUser: RegisteredUser) => {
    const week = `${new Date(
      (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
    ).toLocaleDateString()} - ${new Date(
      (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
    ).toLocaleDateString()}`;
    const userHours = Object.entries(registeredUser?.testHours ?? {})
      .map((testHour: any) => {
        const week = activeRegistration?.slots.find(
          slot => slot.id === testHour[0],
        );
        return `${week?.testDay ?? '<unknown>'} - ${
          testHour?.[1] ?? '<unknown>'
        }`;
      })
      .join(', ');
    const userFirstName = user.displayName.split(' ')[0];
    const content = `Hello ${userFirstName}!%0A%0AYou just registered for the COVID test for the week ${week}.%0A%0AYour testing dates: ${userHours}.`;

    (window as any).Email.send({
      SecureToken: 'd92b5171-f9c5-4573-b866-b87c4d392dd6',
      Username: 'Cognite COVID Test Bot',
      To: user.email,
      From: 'cogcovidtest@gmail.com',
      Subject: `💉 You have registered to a COVID test! Week ${week}`,
      Body: content,
    });
  };

  const mapHours = (id: string) => {
    const slotToMap = chosenDays.find((slot: SlotData) => slot.id === id);
    if (!slotToMap) {
      return (
        <Choice>
          <Spin />
        </Choice>
      );
    }
    return slotToMap.testHours.map((hour: any) => {
      const slotData = slotsData.find(
        (fixedSlot: FixedSlotData) => fixedSlot.id === id,
      );
      if (!slotData) {
        return (
          <Choice>
            <Spin />
          </Choice>
        );
      }
      const fixedTestHour = slotData.testHours.find(
        (testHour: any) => testHour.time === hour,
      );
      if (!fixedTestHour) {
        return (
          <Choice>
            <Spin />
          </Choice>
        );
      }
      const available = fixedTestHour.takenPlaces < fixedTestHour.totalPlaces;
      const percentOfPlacesTaken =
        (fixedTestHour.totalPlaces - fixedTestHour.takenPlaces) /
        fixedTestHour.totalPlaces;
      return (
        <Tooltip
          key={JSON.stringify(hour)}
          title={
            !available && 'All of the slots for this hour are already taken :C'
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
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
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
        <Flex row align style={{ margin: '8px' }}>
          <p style={{ margin: '0 8px 0 0', padding: 0 }}>Are you vaccinated?</p>
          <Switch
            checkedChildren="Yes"
            unCheckedChildren="No"
            checked={vaccinated}
            onChange={setVaccinated}
          />
        </Flex>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Flex>
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button
          type="default"
          size="large"
          style={{ boxShadow: '0 0 20px #000' }}
          onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
