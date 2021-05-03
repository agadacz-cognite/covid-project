import React, { useContext } from 'react';
import { Tooltip, Spin } from 'antd';
import { v4 as uuid } from 'uuid';
import { FixedSlotData, SlotData, TestHoursInSlot } from '../../shared';
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

  const isChosen = (id: string, hour: any) =>
    testHours[id] ? testHours[id] === hour : false;
  const onHourChoose = (id: string, hour: any, available: boolean) => {
    const chosen = isChosen(id, hour);
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
        [id]: hour,
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
    const { hour, places: totalPlaces } = testHour;
    const slotData = slotsData.find(
      (fixedSlot: FixedSlotData) => fixedSlot.id === id,
    );
    if (!slotData) {
      return (
        <Choice key={`mapped-hour-${index}-${hour}-noslotdata`}>
          <Spin />
        </Choice>
      );
    }
    const fixedTestHour = slotData.testHours.find(
      (testHour: any) => testHour.time.hour === hour,
    );
    if (!fixedTestHour) {
      return (
        <Choice key={`mapped-hour-${index}-${hour}-nofixed`}>
          <Spin />
        </Choice>
      );
    }
    const available = fixedTestHour.takenPlaces < totalPlaces;
    const percentOfPlacesTaken =
      (totalPlaces - fixedTestHour.takenPlaces) / totalPlaces;

    return (
      <Tooltip
        key={`mapped-hour-${index}-${hour}-ok`}
        title={
          !available && 'All of the slots for this hour are already taken :C'
        }>
        <Choice
          key={`slot-${id}-${hour}`}
          availability={percentOfPlacesTaken}
          chosen={isChosen(id, hour)}
          onClick={() => onHourChoose(id, hour, available)}>
          <Hour available={available}>{hour}</Hour>
          <Places>
            <span style={{ fontWeight: 'bold' }}>
              {totalPlaces - fixedTestHour.takenPlaces}
            </span>{' '}
            available
          </Places>
        </Choice>
      </Tooltip>
    );
  });
}
