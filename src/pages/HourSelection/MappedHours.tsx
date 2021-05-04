import React, { useContext } from 'react';
import { Tooltip, Spin } from 'antd';
import { v4 as uuid } from 'uuid';
import {
  FixedSlotData,
  SlotData,
  TestHoursInSlot,
  ChosenHours,
} from '../../shared';
import { Choice, Hour, Places } from './components';
import { AppContext } from '../../context';

type MappedHoursProps = {
  id: any;
  chosenDays: any;
  testHours: any;
  setTestHours: any;
};

export default function MappedHours(props: MappedHoursProps): JSX.Element {
  const { id, chosenDays, testHours, setTestHours } = props;
  const { slotsData } = useContext(AppContext);
  const slotToMap = chosenDays.find((slot: SlotData) => slot.id === id);

  const isChosen = (id: string, hourId: string) => {
    const chosenHour = testHours.find(
      (testHour: ChosenHours) =>
        testHour.slotId === id && testHour.hourId === hourId,
    );
    return chosenHour;
  };
  const onHourChoose = (id: string, hourId: string, available: boolean) => {
    const test = {
      slotId: id,
      hourId,
    };
    console.log(test);
    const chosen = isChosen(id, hourId);
    if (chosen) {
      const fixedChosenSlots = testHours;
      delete fixedChosenSlots[id];
      setTestHours({ ...fixedChosenSlots });
    } else {
      if (!available) {
        return;
      }
      const fixedChosenSlots = {
        ...testHours,
        [id]: hourId,
      };
      setTestHours(fixedChosenSlots);
    }
  };

  if (!slotToMap) {
    return (
      <Choice key={`mapped-hour-${uuid()}`}>
        <Spin />
      </Choice>
    );
  }

  return slotToMap.testHours.map((testHour: TestHoursInSlot, index: number) => {
    const { hour, id: hourId } = testHour;
    const slotData = slotsData.find(
      (fixedSlot: FixedSlotData) => fixedSlot.id === id,
    );
    if (!slotData) {
      return (
        <Choice key={`mapped-hour-${index}-${hourId}-noslotdata`}>
          <Spin />
        </Choice>
      );
    }
    const fixedTestHour = slotData.testHours.find(
      (testHour: any) => testHour.time === hour,
    );
    if (!fixedTestHour) {
      return (
        <Choice key={`mapped-hour-${index}-${hourId}-nofixed`}>
          <Spin />
        </Choice>
      );
    }
    const available = fixedTestHour.takenPlaces < fixedTestHour.totalPlaces;
    const remainingPlaces =
      fixedTestHour.totalPlaces - fixedTestHour.takenPlaces;
    const percentOfPlacesTaken = remainingPlaces / fixedTestHour.totalPlaces;

    return (
      <Tooltip
        key={`mapped-hour-${index}-${hourId}-ok`}
        title={
          !available && 'All of the slots for this hour are already taken :C'
        }>
        <Choice
          key={`slot-${id}-${hourId}`}
          availability={percentOfPlacesTaken}
          chosen={isChosen(id, hourId)}
          onClick={() => onHourChoose(id, hourId, available)}>
          <Hour available={available}>{hour}</Hour>
          <Places>
            <span style={{ fontWeight: 'bold' }}>{remainingPlaces}</span>{' '}
            available
          </Places>
        </Choice>
      </Tooltip>
    );
  });
}
