import { db } from '../../firebase';
import { RegisteredUser, RegistrationData } from '../../shared';

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
  console.log(registrations);
  const registrationsFixed: RegisteredUser[] = [];
  registrations.forEach((registrationDoc: any) => {
    registrationsFixed.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });
  console.log(registrationsFixed);
  return registrationsFixed;
};
