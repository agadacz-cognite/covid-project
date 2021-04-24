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
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    });
};
