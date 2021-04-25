export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type SlotData = {
  id: string;
  testDay: Day;
  testHours: string[];
  slotsNr: number;
  officeDays: Day[];
};

export type RegistrationData = {
  slots: SlotData[];
  registrationOpenTime: {
    seconds: number;
    nanoseconds: number;
  };
  week: Date[];
};
