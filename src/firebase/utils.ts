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
export const registerUserForTest = (userToRegister: RegisteredUser): any => {
  db.collection('registrations')
    .get()
    .then(registeredUsersRaw => {
      const registeredUsers = (registeredUsersRaw.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown) as (RegisteredUser & { id: string })[];
      const userWasAlreadyRegistered = registeredUsers.find(
        (previouslyRegisteredUser: { id: string } & RegisteredUser) =>
          userToRegister.email === previouslyRegisteredUser.email &&
          userToRegister.weekId === previouslyRegisteredUser.weekId,
      );
      if (userWasAlreadyRegistered) {
        db.collection('registrations')
          .doc(userWasAlreadyRegistered.id)
          .update(userToRegister)
          .then(() => {
            notification.success({
              message: 'Yay!',
              description: 'You successfully updated your selection!',
            });
          })
          .catch(errorHandler);
      } else {
        db.collection('registrations')
          .add(userToRegister)
          .then(() => {
            notification.success({
              message: 'Yay!',
              description: 'You successfully registered for a test!',
            });
          })
          .catch(errorHandler);
      }
      // TODO this needs to be updated real time!
    });
};
