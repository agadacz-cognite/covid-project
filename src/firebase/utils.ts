import { db } from '.';
import { notification } from 'antd';
import {
  RegistrationData,
  RegisteredUser,
  TestHour,
  ChosenHour,
  SlotData,
  FixedSlotData,
  TestHourInSlot,
  errorHandler,
  activeRegistrationDevOrProd,
  sendEmailToUser,
  isDev,
} from '../shared';

/**
 * Create a new registration as admin
 * @param registrationData the new, edited data of the registration
 */
export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  if (!db) {
    return;
  }
  if (isDev) {
    registrationData.isDev = true;
  }
  return db
    .collection('weeks')
    .doc(registrationData.id)
    .set(registrationData)
    .then(() => {
      db.collection('options').doc(activeRegistrationDevOrProd).set({
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
 * Saves the edited data for the currently active registration
 * @param activeRegistrationId ID of the active registration
 * @param registrationData the new, edited data of the registration
 * @returns
 */
export const editActiveRegistration = (
  activeRegistrationId: string | undefined,
  registrationData: RegistrationData,
): any => {
  if (!db || !activeRegistrationId) {
    return;
  }
  if (isDev) {
    registrationData.isDev = true;
  }
  return db
    .collection('weeks')
    .doc(activeRegistrationId)
    .set(registrationData)
    .then(() =>
      notification.success({
        message: 'Yay!',
        description: 'You successfully edited active registration!',
      }),
    )
    .catch(errorHandler);
};

/**
 * Register user for the testing slot
 * @param userToRegister
 * @param slotsData
 * @returns
 */
export const registerUserForTest = async (
  userToRegister: RegisteredUser,
  activeRegistration: RegistrationData,
): Promise<void> => {
  if (!db) {
    return;
  }
  const userSlotsAreAvailable = await checkIfUsersSlotsAreAvailable(
    userToRegister,
    activeRegistration,
  );
  if (!userSlotsAreAvailable) {
    notification.error({
      message: 'Someone stole your place',
      description:
        'One of the hours you selected are no longer available. Please choose a different one.',
    });
    return;
  }

  try {
    const registeredUsersRef = db.collection('registrations');
    const registeredUsersDoc = await registeredUsersRef.get();
    const registeredUsers: (RegisteredUser & { id: string })[] = [];

    registeredUsersDoc.forEach((registeredUserDoc: any) => {
      registeredUsers.push({
        id: registeredUserDoc.id,
        ...registeredUserDoc.data(),
      });
    });
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
          sendEmailToUser(userToRegister, activeRegistration);
        })
        .catch(error => {
          errorHandler(error);
        });
    } else {
      db.collection('registrations')
        .add(userToRegister)
        .then(() => {
          notification.success({
            message: 'Yay!',
            description: 'You successfully registered for a test!',
          });
        })
        .catch(error => {
          errorHandler(error);
        });
    }
  } catch (error) {
    errorHandler(error);
  }
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

/**
 * Checks if the slot that user had chosen to register to is still free.
 * @param userToRegister
 * @param activeRegistration
 * @returns
 */
export const checkIfUsersSlotsAreAvailable = async (
  userToRegister: RegisteredUser,
  activeRegistration: RegistrationData,
): Promise<boolean> => {
  const weekId = activeRegistration.id;
  const registrationsForThisWeekRef = db
    .collection('registrations')
    .where('weekId', '==', weekId);

  const registrationsForThisWeekDoc = await registrationsForThisWeekRef.get();
  const registrationsForThisWeek: any = [];
  registrationsForThisWeekDoc.forEach((registrationDoc: any) => {
    registrationsForThisWeek.push({
      ...registrationDoc.data(),
    });
  });

  const slots: any = activeRegistration?.slots.map((slot: SlotData) => {
    const testHours = slot.testHours;
    const fixedSlot = {
      id: slot.id,
      testHours: testHours.map((testHour: TestHourInSlot) => {
        return {
          hourId: testHour.id,
          totalPlaces: testHour.places ?? 15,
          takenPlaces: registrationsForThisWeek.filter(
            (registeredUser: RegisteredUser) => {
              const usersChosenHours = registeredUser.testHours.find(
                (userTestHour: ChosenHour) => {
                  return (
                    userTestHour.slotId === slot.id &&
                    userTestHour.hourId === testHour.id
                  );
                },
              );
              return registeredUser.weekId === weekId && usersChosenHours;
            },
          ).length,
        };
      }),
    };
    return fixedSlot;
  });

  const userSlotsAreAvailableArray = userToRegister.testHours.map(
    (testHour: ChosenHour) => {
      const slot = slots.find(
        (slotData: FixedSlotData) => slotData.id === testHour.slotId,
      );
      if (!slot) {
        return false;
      }
      const hour = slot?.testHours.find(
        (hour: TestHour) => hour.hourId === testHour.hourId,
      );
      if (!hour) {
        return false;
      }
      const available = hour.takenPlaces < hour?.totalPlaces;
      if (available) {
        return true;
      }
      return false;
    },
  );
  const userSlotsAreAvailable = userSlotsAreAvailableArray.reduce(
    (sum, next) => sum && next,
  );
  return userSlotsAreAvailable;
};
