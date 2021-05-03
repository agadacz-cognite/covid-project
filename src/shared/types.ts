export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Time = {
  seconds: number;
  nanoseconds: number;
};

export type TestHoursInSlot = {
  hour: string;
  places: number;
  id: string;
};
export type SlotData = {
  id: string;
  testDay: Day;
  testHours: TestHoursInSlot[];
  slotsNr: number;
  officeDays: Day[];
};

export type TestHours = {
  time: TestHoursInSlot;
  totalPlaces: number;
  takenPlaces: number;
};

export type FixedSlotData = {
  id: string;
  testHours: TestHours[];
};

export type RegistrationData = {
  id: string;
  slots: SlotData[];
  registrationOpenTime: Time;
  week: Time[];
};

export type RegisteredUser = {
  id?: string;
  email: string;
  name: string;
  weekId: string;
  manager: string;
  registeredTimestamp: number;
  vaccinated: boolean;
  testHours: {
    [weekId: string]: string;
  };
};

export type SendEmailProps = {
  email: string;
  subject: string;
  content: string;
};
