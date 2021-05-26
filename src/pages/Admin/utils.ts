import { v4 as uuid } from 'uuid';
import { SlotData } from '../../shared';

export const defaultPlaces = 200;
export const defaultHour = 'all day';
export const defaultMaxPlaces = 1000;
export const defaultNewHour = {
  hour: defaultHour,
  places: defaultPlaces,
  id: uuid(),
};

export const defaultSlot: SlotData = {
  id: uuid(),
  testDay: 'Monday',
  testHours: [
    { hour: 'all day', places: 200, id: uuid() },
    // { hour: '8:00', places: 20, id: uuid() },
    // { hour: '8:20', places: 20, id: uuid() },
    // { hour: '8:40', places: defaultPlaces, id: uuid() },
    // { hour: '9:00', places: defaultPlaces, id: uuid() },
    // { hour: '9:20', places: defaultPlaces, id: uuid() },
    // { hour: '9:40', places: defaultPlaces, id: uuid() },
    // { hour: '10:00', places: defaultPlaces, id: uuid() },
    // { hour: '10:20', places: defaultPlaces, id: uuid() },
  ],
  // officeDays: ['Monday', 'Tuesday', 'Wednesday'],
  officeDays: ['Monday'],
};

export const possibleDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const possibleHours: any[] = [
  'all day',
  '8:00',
  '8:10',
  '8:20',
  '8:30',
  '8:40',
  '8:50',
  '9:00',
  '9:10',
  '9:20',
  '9:30',
  '9:40',
  '9:50',
  '10:00',
  '10:10',
  '10:20',
  '10:30',
  '10:40',
  '10:50',
  '11:00',
  '11:10',
  '11:20',
  '11:30',
  '11:40',
  '11:50',
  '12:00',
];
