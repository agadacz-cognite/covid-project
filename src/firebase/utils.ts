import { v4 as uuid } from 'uuid';

import { db } from '.';

type RegistrationData = {
  startsAt: number;
  dates: any[];
};

export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  console.log(db);
  const { startsAt } = registrationData;
  return db
    .collection('registrations')
    .add({
      week: uuid(),
      startsAt,
    })
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    });
};
