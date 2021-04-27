import { db } from '.';
import { notification } from 'antd';
import { errorHandler, RegistrationData, RegisteredUser } from '../shared';

export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  if (!db) {
    return;
  }
  return db
    .collection('weeks')
    .doc(registrationData.id)
    .set(registrationData)
    .then(() => {
      db.collection('options').doc('activeRegistration').update({
        id: registrationData.id,
      });
      notification.success({
        message: 'Yay!',
        description: 'You successfully opened a new registration!',
      });
    })
    .catch(errorHandler);
};

export const registerUserForTest = (userToRegister: RegisteredUser): any => {
  if (!db) {
    return;
  }
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
