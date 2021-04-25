import { db } from '.';
import { notification } from 'antd';
import { errorHandler, RegistrationData } from '../shared';

export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  return db
    .collection('weeks')
    .add(registrationData)
    .then(docRef => {
      const id = docRef.id;
      db.collection('options').doc('activeRegistration').update({
        id,
      });
      notification.success({
        message: 'Yay!',
        description: 'You successfully opened a new registration!',
      });
    })
    .catch(errorHandler);
};

type RegisteredUser = {
  email: string;
  weekId: string;
  manager: string;
  testHours: {
    [weekId: string]: string;
  };
};
export const registerUserForTest = (registeredUser: RegisteredUser): any => {
  return db
    .collection('registrations')
    .add(registeredUser)
    .then(() => {
      notification.success({
        message: 'Yay!',
        description: 'You successfully registered for a test!',
      });
    })
    .catch(errorHandler);
};
