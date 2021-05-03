import { db } from '.';
import { notification } from 'antd';
import {
  errorHandler,
  RegistrationData,
  RegisteredUser,
  TestHours,
} from '../shared';
import { FixedSlotData } from '../shared';

/**
 * Create a new registration as admin
 */
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
      db.collection('options').doc('activeRegistrationTest').update({
        // TODO remove TEST
        id: registrationData.id,
      });
      notification.success({
        message: 'Yay!',
        description: 'You successfully opened a new registration!',
      });
    })
    .catch(errorHandler);
};

/**
 * Register user for the testing slot
 * @param userToRegister
 * @param slotsData
 * @returns
 */
export const registerUserForTest = (
  userToRegister: RegisteredUser,
  slotsData: FixedSlotData[],
): Promise<void> => {
  return new Promise(resolve => {
    if (!db) {
      return resolve();
    }
    const userSlotsAreAvailableArray = Object.entries(
      userToRegister.testHours,
    ).map((testHour: string[]) => {
      const slot = slotsData.find(
        (slotData: FixedSlotData) => slotData.id === testHour[0],
      );
      if (!slot) {
        return false;
      }
      const hour = slot?.testHours.find(
        (hour: TestHours) => hour.time.hour === testHour[1],
      );
      if (!hour) {
        return false;
      }
      const available = hour.takenPlaces < hour?.totalPlaces;
      if (available) {
        return true;
      }
      return false;
    });
    const userSlotsAreAvailable = userSlotsAreAvailableArray.reduce(
      (sum, next) => sum && next,
    );
    if (!userSlotsAreAvailable) {
      notification.error({
        message: 'Someone stole your place',
        description:
          'One of the hours you selected are no longer available. Please choose a different one.',
      });
      return resolve();
    }

    try {
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
                return resolve();
              })
              .catch(error => {
                errorHandler(error);
                return resolve();
              });
          } else {
            db.collection('registrations')
              .add(userToRegister)
              .then(() => {
                notification.success({
                  message: 'Yay!',
                  description: 'You successfully registered for a test!',
                });
                return resolve();
              })
              .catch(error => {
                errorHandler(error);
                return resolve();
              });
          }
        });
    } catch (error) {
      resolve();
    }
  });
};

/** Delee user from the testing slot */
export const removeUserRegistration = (
  weekId: string,
  email: string,
): Promise<void> => {
  return new Promise((resolve: any) => {
    if (!db) {
      return resolve();
    }
    const userRef = db
      .collection('registrations')
      .where('weekId', '==', weekId)
      .where('email', '==', email);
    userRef
      .get()
      .then(userSnapshot =>
        userSnapshot.forEach(user =>
          user.ref
            .delete()
            .then(() => {
              notification.success({
                message: 'Yay!',
                description: 'You successfully deleted your selection!',
              });
              return resolve();
            })
            .catch(error => {
              errorHandler(error);
              return resolve();
            }),
        ),
      )
      .catch(error => {
        errorHandler(error);
        return resolve();
      });
  });
};
