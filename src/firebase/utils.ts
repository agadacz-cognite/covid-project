import { db } from '.';

type RegistrationData = {
  week: Date[];
  registrationOpenTime: Date;
  dates: any[];
};

export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  return db
    .collection('registrations')
    .add(registrationData)
    .catch(error => {
      alert(error);
    });
};
