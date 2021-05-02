import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import deepEqual from 'deep-equal';
import { AppContext } from '.';
import { db } from '../firebase';
import {
  errorHandler,
  RegistrationData,
  RegisteredUser,
  SlotData,
  FixedSlotData,
} from '../shared';

/**
 * Retrieves fresh data about active registration straight from database.
 */
export const useActiveRegistration = (): void => {
  const { activeRegistration, setActiveRegistration } = useContext(AppContext);

  useEffect(() => {
    const activeRegistrationRef = db
      .collection('options')
      .doc('activeRegistration');
    let unsubscribeWeeks: any;
    const unsubscribeActiveRegistration = activeRegistrationRef.onSnapshot(
      option => {
        if (!option.exists) {
          notification.error({
            message: 'Something went wrong.',
            description:
              'Something went wrong when trying to retrieve data of the active registration from database.',
          });
          return;
        } else {
          const freshActiveRegistration = option.data();
          const id = freshActiveRegistration?.id;
          unsubscribeWeeks = db
            .collection('weeks')
            .doc(id)
            .onSnapshot(week => {
              if (!week.exists) {
                return undefined;
              } else {
                const fixedWeek = week.data() as RegistrationData | undefined;
                if (!deepEqual(activeRegistration, fixedWeek)) {
                  setActiveRegistration(fixedWeek);
                }
              }
            }, errorHandler);
        }
      },
      errorHandler,
    );
    return () => {
      unsubscribeActiveRegistration && unsubscribeActiveRegistration();
      unsubscribeWeeks && unsubscribeWeeks();
    };
  }, []);
};

/**
 * Checks if the user has admin permissions.
 * @returns boolean
 */
export const useIsUserAdmin = (): any => {
  const { admins, setAdmins, user } = useContext(AppContext);
  if (admins?.length && user?.email) {
    if (admins.includes(user?.email)) {
      return true;
    }
    return false;
  }

  const adminsRef = db.collection('options').doc('admins');
  adminsRef.get().then(option => {
    if (!option.exists) {
      notification.error({
        message: 'Something went wrong.',
        description: 'Something went wrong when trying to get admins.',
      });
      return false;
    } else {
      const emails: string[] = option.data()?.emails;
      setAdmins(emails);
      if (emails.includes(user?.email)) {
        return true;
      }
      return false;
    }
  });
};

/**
 * Redirects user to the main page if they do not have admin permissions.
 */
export const useBackIfNotAdmin = (): void => {
  const isAdmin = useIsUserAdmin();
  const history = useHistory();
  useEffect(() => {
    if (!isAdmin) {
      history.push('/start');
    }
  }, [isAdmin]);
};

/**
 * Redirects user to login page if they are not logged in.
 */
export const useBackIfNotLogged = (): void => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [user]);
};

/**
 * Prepares the information about the availability of the slots for the passed week.
 * @param weekId string|undefined
 */
export const useAvailablePlacesForSlots = async (
  weekId: string | undefined,
): Promise<any> => {
  const { slotsData, setSlotsData } = useContext(AppContext);

  useEffect(() => {
    if (!weekId) {
      return;
    }
    db.collection('weeks')
      .doc(weekId)
      .get()
      .then((weeksDoc: any) => {
        if (!weeksDoc.exists) {
          return;
        }
        const weeksRaw = weeksDoc.data();
        const registrationsRef = db
          .collection('registrations')
          .where('weekId', '==', weekId);
        const unsubscribe = registrationsRef.onSnapshot(
          (registrationsDocs: any) => {
            const registrations: RegisteredUser[] = [];
            registrationsDocs.forEach((registrationDoc: any) => {
              registrations.push({
                id: registrationDoc.id,
                ...registrationDoc.data(),
              });
            });
            const slots: FixedSlotData[] = weeksRaw?.slots.map(
              (slot: SlotData) => ({
                id: slot.id,
                testHours: slot.testHours.map((testHour: string) => ({
                  time: testHour,
                  totalPlaces: slot.slotsNr,
                  takenPlaces: registrations.filter(
                    (registeredUser: RegisteredUser) =>
                      registeredUser.weekId === weekId &&
                      registeredUser.testHours[slot.id] === testHour,
                  ).length,
                })),
              }),
            );
            if (!deepEqual(slots, slotsData)) {
              setSlotsData(slots);
            }
          },
          errorHandler,
        );
        return () => {
          unsubscribe();
        };
      });
  }, []);
};

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

/**
 * Prepares list of the emails which are allowed to preregister.
 * @returns
 */
export const usePreregisteredEmails = (): void => {
  const { setPreregistrationEmails } = useContext(AppContext);
  const isAdmin = useIsUserAdmin();

  if (!isAdmin) {
    return;
  }

  useEffect(() => {
    const docRef = db.collection('options').doc('preregistration');
    docRef
      .get()
      .then(preregistrationDoc => {
        if (!preregistrationDoc.exists) {
          return;
        }
        const preregistration = preregistrationDoc.data();
        setPreregistrationEmails(preregistration?.emails ?? []);
      })
      .catch(errorHandler);
  }, []);
};

/**
 * Prepares info if the currently logged in user has permissions to preregister.
 */
export const useCanUserPreregister = (): void => {
  const { user, setCanPreregister } = useContext(AppContext);

  useEffect(() => {
    if (!user?.email) {
      return;
    }
    const docRef = db.collection('options').doc('preregistration');
    docRef
      .get()
      .then(preregistrationDoc => {
        if (!preregistrationDoc.exists) {
          return;
        }
        const preregistration = preregistrationDoc.data();
        if (preregistration?.emails.includes(user.email)) {
          setCanPreregister(true);
        } else {
          setCanPreregister(false);
        }
      })
      .catch(errorHandler);
  }, [user]);
};
