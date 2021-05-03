import { useEffect, useContext } from 'react';
import deepEqual from 'deep-equal';
import { AppContext } from '../';
import { db } from '../../firebase';
import { errorHandler, RegisteredUser } from '../../shared';

/**
 * Prepares information about the logged user's rejestration.
 * @param email
 * @param weekId
 */
export const useUsersRegistration = async (
  email: string | undefined,
  weekId: string | undefined,
): Promise<any> => {
  const { usersRegistration, setUsersRegistration, loading } = useContext(
    AppContext,
  );

  useEffect(() => {
    if (!weekId || !email) {
      return;
    }
    const docRef = db
      .collection('registrations')
      .where('weekId', '==', weekId)
      .where('email', '==', email);
    const unsubscribe = docRef.onSnapshot((registrationsDocs: any) => {
      const registrations: RegisteredUser[] = [];
      registrationsDocs.forEach((registrationDoc: any) => {
        registrations.push({
          id: registrationDoc.id,
          ...registrationDoc.data(),
        });
      });
      const newUsersRegistration = registrations.find(
        (registration: RegisteredUser) => registration,
      );

      if (!deepEqual(usersRegistration, newUsersRegistration)) {
        setUsersRegistration(newUsersRegistration);
      }
    }, errorHandler);
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [weekId, email, loading]);
};
