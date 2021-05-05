export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Time = {
  seconds: number;
  nanoseconds: number;
};

export type TestHourInSlot = {
  hour: string;
  places: number;
  id: string;
};
export type SlotData = {
  id: string;
  testDay: Day;
  testHours: TestHourInSlot[];
  officeDays: Day[];
};

export type TestHour = {
  hourId: string;
  time: string;
  totalPlaces: number;
  takenPlaces: number;
};

export type ChosenHour = {
  slotId: string;
  hourId: string;
};

export type FixedSlotData = {
  id: string;
  testHours: TestHour[];
};

export type RegistrationData = {
  id: string;
  slots: SlotData[];
  registrationOpenTime: Time;
  week: Time[];
  legacy?: boolean;
  isDev?: boolean;
  openedBy?: string;
};

export type RegisteredUser = {
  id?: string;
  email: string;
  name: string;
  weekId: string;
  manager: string;
  registeredTimestamp: number;
  vaccinated: boolean;
  testHours: ChosenHour[];
};

export type SendEmailProps = {
  email: string;
  subject: string;
  content: string;
};
