import { db } from '../../firebase';
import { notification } from 'antd';
import {
  RegisteredUser,
  RegistrationData,
  SlotData,
  errorHandler,
} from '../../shared';

/**
 * Function preparing the registration data to be displayed in a table
 * @param activeRegistration
 * @returns
 */
export const getRegistrationsForThisWeek = async (
  activeRegistration: RegistrationData | undefined,
): Promise<any> => {
  if (!activeRegistration) {
    return;
  }
  const weekId = activeRegistration.id;

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
  }));

  const usersMappedToSlots = allSlots.map((slot: any) => {
    const { slotId } = slot;
    const users = registrations
      .filter((registeredUser: RegisteredUser) => {
        const userInThisSlot = registeredUser.testHours[slotId];
        return userInThisSlot;
      })
      .map((registeredUser: RegisteredUser) => {
        const userInThisSlot = registeredUser.testHours[slotId];
        const usersRegisteredHour =
          !userInThisSlot.startsWith('0') && userInThisSlot.length === 4
            ? `0${userInThisSlot}`
            : userInThisSlot;
        const userRegistrationData = {
          registeredAt: registeredUser?.registeredTimestamp ?? 0,
          name: registeredUser?.name ?? registeredUser?.email ?? '<unknown>',
          manager: registeredUser?.manager ?? '<unknown>',
          hour: usersRegisteredHour,
          vaccinated: registeredUser.vaccinated ? 'X' : '',
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
  activeRegistration: RegistrationData | undefined,
): Promise<any> => {
  if (!activeRegistration) {
    return;
  }
  const weekId = activeRegistration.id;

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
  const allSlots = week.slots.map((slot: SlotData) => slot.id);

  const usersMappedToSlots = allSlots.map((slotId: string) => {
    const users = registrations.map((registeredUser: RegisteredUser) => {
      const userInThisSlot = registeredUser.testHours[slotId];
      if (!userInThisSlot) {
        return ['', '', '', '', '', '', ''];
      }
      const usersRegisteredHour =
        !userInThisSlot.startsWith('0') && userInThisSlot.length === 4
          ? `0${userInThisSlot}`
          : userInThisSlot;
      const field = [
        '', //
        '',
        registeredUser.registeredTimestamp
          ? new Date(registeredUser.registeredTimestamp).toLocaleString(
              'no-NO',
              {
                hour12: false,
              },
            )
          : 0,
        registeredUser.name ?? registeredUser.email,
        registeredUser.manager,
        usersRegisteredHour,
        registeredUser.vaccinated ? 'X' : '',
      ];
      return field;
    });
    return users;
  });

  const mergedUsers: any[] = [];
  usersMappedToSlots[0].forEach((_, i) => {
    const otherSlotsForUser = usersMappedToSlots.map(user => user[i]);
    mergedUsers.push(otherSlotsForUser.flat());
  });

  const headers = [
    weekDate,
    ...week.slots.map((slot: SlotData) => [
      slot.testDay.toUpperCase(),
      'Registered at',
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
      .catch(error => {
        errorHandler(error);
        resolve();
      });
  });
};
