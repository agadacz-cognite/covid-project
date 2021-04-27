import { db } from '../../firebase';
import { RegisteredUser, RegistrationData, SlotData } from '../../shared';

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
  const registrations = await registrationsRef.get();
  const registrationsFixed: RegisteredUser[] = [];
  registrations.forEach((registrationDoc: any) => {
    registrationsFixed.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });

  const weeks = await db.collection('weeks').where('id', '==', weekId).get();
  const weeksFixed: RegistrationData[] = [];
  weeks.forEach((weekDoc: any) => {
    weeksFixed.push({
      ...weekDoc.data(),
    });
  });
  const weekFixed = weeksFixed[0];
  const weekDate = weekFixed.week
    .map(week => new Date(week.seconds * 1000).toLocaleDateString())
    .flat()
    .join(' - ');

  const headers = [
    weekDate,
    ...weekFixed.slots.map((slot: SlotData) => [
      slot.testDay,
      'Name',
      'Manager',
      'Hour',
      '',
    ]),
  ];
  const fields: any = [];
  registrationsFixed.forEach((registeredUser: RegisteredUser) => {
    fields.push([
      '', //
      '',
      registeredUser.name ?? registeredUser.email,
      registeredUser.manager,
    ]);
  });

  const test = [headers.flat(), ...fields];
  return test;
};
