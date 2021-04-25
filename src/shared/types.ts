export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Time = {
  seconds: number;
  nanoseconds: number;
};

export type SlotData = {
  id: string;
  testDay: Day;
  testHours: string[];
  slotsNr: number;
  officeDays: Day[];
};

export type RegistrationData = {
  id: string;
  slots: SlotData[];
  registrationOpenTime: Time;
  week: Time[];
};
