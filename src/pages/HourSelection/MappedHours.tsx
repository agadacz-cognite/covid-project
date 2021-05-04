import React, { useContext } from 'react';
import { Tooltip, Spin } from 'antd';
import { v4 as uuid } from 'uuid';
import {
  FixedSlotData,
  SlotData,
  TestHourInSlot,
  ChosenHour,
  TestHour,
  // translateHourIdToHour,
} from '../../shared';
import { Choice, Hour, Places } from './components';
import { AppContext } from '../../context';

type MappedHoursProps = {
  id: string;
  chosenDays: SlotData[];
  testHours: ChosenHour[];
  setTestHours: (chosenHours: ChosenHour[]) => void;
};

export default function MappedHours(props: MappedHoursProps): JSX.Element {
  const { id, chosenDays, testHours, setTestHours } = props;
  const { slotsData } = useContext(AppContext);
  const slotToMap = chosenDays.find((slot: SlotData) => slot.id === id);

  const isChosenSlotAndHour = (slotId: string, hourId: string) => {
    const chosenHour = testHours.find(
      (testHour: ChosenHour) =>
        testHour.slotId === slotId && testHour.hourId === hourId,
    );
    return Boolean(chosenHour);
  };
  const isChosenSlot = (slotId: string) => {
    const chosenSlot = testHours.find(
      (testHour: ChosenHour) => testHour.slotId === slotId,
    );
    return Boolean(chosenSlot);
  };
  const onHourChoose = (slotId: string, hourId: string, available: boolean) => {
    const chosenSlotAndHour = isChosenSlotAndHour(slotId, hourId);
    const chosenSlot = isChosenSlot(slotId);
    if (chosenSlotAndHour) {
      // this hour is chosen; we unselect it
      const fixedChosenSlots = testHours.filter(
        (testHour: ChosenHour) => testHour.hourId !== hourId,
      );
      setTestHours(fixedChosenSlots);
    } else if (chosenSlot) {
      // this slot has hour selected; change the selection for the slot
      const fixedChosenSlots = [
        ...testHours.filter(
          (testHour: ChosenHour) => testHour.slotId !== slotId,
        ),
        {
          slotId,
          hourId,
        },
      ];
      setTestHours(fixedChosenSlots);
    } else if (!chosenSlot && !chosenSlotAndHour) {
      // nothing is selected; select
      if (!available) {
        return;
      }
      const fixedChosenSlots = [
        ...testHours,
        {
          slotId,
          hourId,
        },
      ];
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

  const mappedSlots = slotToMap.testHours.map(
    (testHour: TestHourInSlot, index: number) => {
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
        (testHour: TestHour) => testHour.hourId === hourId,
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

      // const dupa = translateHourIdToHour(testHours);

      return (
        <Tooltip
          key={`mapped-hour-${index}-${hourId}-ok`}
          title={
            !available && 'All of the slots for this hour are already taken :C'
          }>
          <Choice
            key={`slot-${id}-${hourId}`}
            availability={percentOfPlacesTaken}
            chosen={isChosenSlotAndHour(id, hourId)}
            onClick={() => onHourChoose(id, hourId, available)}>
            <Hour available={available}>{hour}</Hour>
            <Places>
              <span style={{ fontWeight: 'bold' }}>{remainingPlaces}</span>{' '}
              available
            </Places>
          </Choice>
        </Tooltip>
      );
    },
  );

  return <>{mappedSlots}</>;
}
