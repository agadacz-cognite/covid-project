import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Switch, notification } from 'antd';
import {
  AppContext,
  useBackIfNotLogged,
  useActiveRegistration,
  useAvailablePlacesForSlots,
} from '../../context';
import { registerUserForTest } from '../../firebase';
import { SlotData, ChosenHour } from '../../shared';
import { Flex, Card, SlackLink } from '../../components';
import MappedHours from './MappedHours';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const {
    user,
    setLoading,
    usersRegistration,
    activeRegistration,
  } = useContext(AppContext);
  const [managerName, setManagerName] = useState('');
  const [chosenDays, setChosenDays] = useState<SlotData[]>([]);
  const [testHours, setTestHours] = useState<ChosenHour[]>([]);
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
    if (usersRegistration?.testHours) {
      setTestHours(usersRegistration.testHours);
      setVaccinated(usersRegistration.vaccinated);
      setManagerName(usersRegistration.manager);
    }
  }, []);

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
    await registerUserForTest(
      usersRegistration,
      registeredUser,
      activeRegistration,
      history,
    );
    setLoading(false);
  };
  const onBack = () => history.push('/start');

  return (
    <Flex column align style={{ margin: 'auto', maxWidth: '1250px' }}>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        {chosenDays?.map((slot: SlotData, index: number) => (
          <Card
            key={`${slot.id}-${index}`}
            title={
              <Flex align justify style={{ fontWeight: 'bold' }}>
                {slot.testDay}
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '500px' }}>
            <p>After registering below, you can come to the office at:</p>
            <ul>
              {slot.officeDays.map((day: string) => (
                <li key={`${slot.id}-${day}`}>{day}</li>
              ))}
            </ul>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              <MappedHours
                id={slot.id}
                chosenDays={chosenDays}
                testHours={testHours}
                setTestHours={setTestHours}
              />
            </Flex>
          </Card>
        ))}
      </Flex>
      <Flex
        column
        style={{
          margin: '8px',
          padding: '8px',
          backgroundColor: 'white',
          width: '100%',
        }}>
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
      <SlackLink />
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
