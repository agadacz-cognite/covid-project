import { db } from '../../firebase';
import { notification } from 'antd';
import {
  RegisteredUser,
  RegistrationData,
  SlotData,
  errorHandler,
} from '../../shared';

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
  const allSlots = week.slots.map((slot: SlotData) => slot.id);

  const usersMappedToSlots = allSlots.map((slotId: string) => {
    const users = registrations.map((registeredUser: RegisteredUser) => {
      const userInThisSlot = registeredUser.testHours[slotId];
      if (!userInThisSlot) {
        return ['', '', '', '', '', ''];
      }
      const field = [
        '', //
        '',
        registeredUser.name ?? registeredUser.email,
        registeredUser.manager,
        userInThisSlot, // this is the hour when user has the test
        registeredUser.vaccinated ? 'X' : '',
      ];
      return field;
    });
    return users;
  });

  const mergedUsers = usersMappedToSlots.map((_, i) => {
    const otherSlotsForUser = usersMappedToSlots.map(user => user[i]);
    return otherSlotsForUser.flat();
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
