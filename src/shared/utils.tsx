import { db } from '../firebase';
import { notification } from 'antd';
import { RegisteredUser, RegistrationData, SlotData, errorHandler } from '.';
import { TestHoursInSlot, ChosenHours } from './types';

/**
 * Function preparing the registration data to be displayed in a table
 * @param activeRegistration
 * @returns
 */
export const getRegistrationsForThisWeek = async (
  weekId: string | undefined,
): Promise<any> => {
  if (!weekId) {
    return;
  }

  const registrationsRef = db
    .collection('registrations')
    .where('weekId', '==', weekId);
  const registrationsDoc = await registrationsRef.get();
  const registrations: RegisteredUser[] = [];
  registrationsDoc.forEach((registrationDoc: any) => {
    registrations.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });

  const weeksRef = db.collection('weeks').where('id', '==', weekId);
  const weeksDoc = await weeksRef.get();
  const weeks: RegistrationData[] = [];
  weeksDoc.forEach((weekDoc: any) => {
    weeks.push({
      ...weekDoc.data(),
    });
  });
  const week = weeks[0];
  const weekDate = week.week
    .map(w => new Date(w.seconds * 1000).toLocaleDateString())
    .flat()
    .join(' - ');
  const allSlots = week.slots.map((slot: SlotData) => ({
    slotId: slot.id,
    testDay: slot.testDay,
    testHours: slot.testHours,
  }));

  const usersMappedToSlots = allSlots.map((slot: any) => {
    const { slotId } = slot;
    const registeredUsers = registrations.filter(
      (registeredUser: RegisteredUser) => {
        const userRegistrationTimeForSlot = registeredUser.testHours[slotId];
        return userRegistrationTimeForSlot;
      },
    );
    const users = registeredUsers.map((registeredUser: RegisteredUser) => {
      const userRegistrationTimeForSlot = registeredUser.testHours.find(
        (userTestHours: ChosenHours) => userTestHours.slotId === slotId,
      );
      console.log(userRegistrationTimeForSlot);
      const allUsersRegisteredForSlot = registrations
        .filter(
          (rU: RegisteredUser) =>
            rU.weekId === weekId &&
            rU.testHours[slotId] === userRegistrationTimeForSlot,
        )
        .sort((a, b) => a.registeredTimestamp - b.registeredTimestamp);
      const placesTaken = allUsersRegisteredForSlot.length;
      console.log(slot);
      console.log(allUsersRegisteredForSlot);
      // TODO
      const registrationsOverLimit = placesTaken - slot.slotsNr;
      const registeredTooLate =
        registrationsOverLimit > 0 &&
        allUsersRegisteredForSlot.findIndex(
          u => u.email === registeredUser.email,
        ) >= slot.slotsNr;
      const usersRegisteredHourId = userRegistrationTimeForSlot?.hourId;
      const usersRegisteredHourMapped = slot.testHours.find(
        (slotTestHour: TestHoursInSlot) =>
          slotTestHour.id === usersRegisteredHourId,
      );
      const usersRegisteredHour =
        !usersRegisteredHourMapped.startsWith('0') &&
        usersRegisteredHourMapped?.length === 4
          ? `0${userRegistrationTimeForSlot}`
          : userRegistrationTimeForSlot;
      const userRegistrationData = {
        registeredAt: registeredUser?.registeredTimestamp ?? 0,
        name: registeredUser?.name ?? registeredUser?.email ?? '<unknown>',
        manager: registeredUser?.manager ?? '<unknown>',
        hour: usersRegisteredHour,
        email: registeredUser?.email ?? 'cogcovidtest@gmail.com',
        vaccinated: registeredUser.vaccinated ? 'X' : '',
        registeredTooLate,
      };
      return userRegistrationData;
    });
    return users;
  });

  const finalData = {
    weekDate,
    usersRegistrationData: usersMappedToSlots,
    weeks: week.slots.map((slot: SlotData) => slot.testDay),
  };
  return finalData;
};

/**
 * Function preparing data specifically for Excel export
 * @param activeRegistration
 * @param preparedForExcel
 * @returns
 */
export const getRegistrationsForExcel = async (
  weekId: string | undefined,
): Promise<any> => {
  if (!weekId) {
    return;
  }

  const registrationsRef = db
    .collection('registrations')
    .where('weekId', '==', weekId);
  const registrationsDoc = await registrationsRef.get();
  const registrations: RegisteredUser[] = [];
  registrationsDoc.forEach((registrationDoc: any) => {
    registrations.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });

  const weeksRef = db.collection('weeks').where('id', '==', weekId);
  const weeksDoc = await weeksRef.get();
  const weeks: RegistrationData[] = [];
  weeksDoc.forEach((weekDoc: any) => {
    weeks.push({
      ...weekDoc.data(),
    });
  });
  const week = weeks[0];
  const weekDate = week.week
    .map((w: any) => new Date(w.seconds * 1000).toLocaleDateString())
    .flat()
    .join(' - ');
  const allSlots = week.slots.map((slot: SlotData) => ({
    slotId: slot.id,
    slotTestHours: slot.testHours,
  }));

  const usersMappedToSlots = allSlots.map(
    ({
      slotId,
      slotTestHours,
    }: {
      slotId: string;
      slotTestHours: TestHoursInSlot[];
    }) => {
      const users = registrations.map((registeredUser: RegisteredUser) => {
        const userInThisSlot = registeredUser.testHours.find(
          (userTestHour: ChosenHours) => userTestHour.slotId === slotId,
        );
        if (!userInThisSlot) {
          return ['', '', '', '', '', ''];
        }
        const registeredHour = slotTestHours.find(
          (slotTestHour: TestHoursInSlot) =>
            slotTestHour.id === userInThisSlot.hourId,
        )?.hour;
        const usersRegisteredHour =
          !registeredHour?.startsWith('0') && registeredHour?.length === 4
            ? `0${registeredHour}`
            : registeredHour;
        const field = [
          '',
          '',
          registeredUser.name ?? registeredUser.email,
          registeredUser.manager,
          usersRegisteredHour,
          registeredUser.vaccinated ? 'X' : '',
        ];
        return field;
      });
      return users;
    },
  );

  const mergedUsers: any[] = [];
  usersMappedToSlots[0].forEach((_: any, i: number) => {
    const otherSlotsForUser = usersMappedToSlots.map((user: any) => user[i]);
    mergedUsers.push(otherSlotsForUser.flat());
  });

  const headers = [
    weekDate,
    ...week.slots.map((slot: SlotData) => [
      slot.testDay.toUpperCase(),
      'Name',
      'Manager',
      'Hour',
      'Vaccinated?',
      '',
    ]),
  ];

  const final = [headers.flat(), ...mergedUsers];
  return { final, weekDate };
};

/**
 * Saves the email of people allowed to preregistration to database.
 * @param emails string[]
 * @returns void
 */
export const savePreregistrationEmails = (emails: string[]): Promise<void> => {
  return new Promise(resolve => {
    if (!db) {
      resolve();
      return;
    }
    db.collection('options')
      .doc('preregistration')
      .set({
        emails,
      })
      .then(() => {
        notification.success({
          message: 'Yay!',
          description: 'You successfully added emails to preregistration list!',
        });
        resolve();
      })
      .catch((error: any) => {
        errorHandler(error);
        resolve();
      });
  });
};

/**
 * Closes the active registration.
 * @returns
 */
export const closeActiveRegistration = (): Promise<void> => {
  return new Promise(resolve => {
    if (!db) {
      resolve();
      return;
    }
    db.collection('options')
      .doc('activeRegistrationTest') // TODO remove TEST
      .delete()
      .then(() => {
        notification.success({
          message: 'Yay!',
          description: 'You successfully closed the registration!',
        });
        return resolve();
      })
      .catch(error => {
        errorHandler(error);
        return resolve();
      });
  });
};
