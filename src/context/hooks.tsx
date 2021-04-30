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

export const useActiveRegistration = (): void => {
  const { activeRegistration, setActiveRegistration } = useContext(AppContext);

  useEffect(() => {
    const activeRegistrationRef = db
      .collection('options')
      .doc('activeRegistration');
    let unsubscribeWeeks: any;
    const unsubscribeActiveRegistration = activeRegistrationRef.onSnapshot(
      (option: any) => {
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
            .onSnapshot((week: any) => {
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

export const useIsUserAdmin = (): any => {
  const { admins, setAdmins, user } = useContext(AppContext);
  if (admins?.length && user?.email) {
    if (admins.includes(user?.email)) {
      return true;
    }
    return false;
  }

  const adminsRef = db.collection('options').doc('admins');
  adminsRef.get().then((option: any) => {
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

export const useBackIfNotAdmin = (): void => {
  const isAdmin = useIsUserAdmin();
  const history = useHistory();
  useEffect(() => {
    if (!isAdmin) {
      history.push('/start');
    }
  }, [isAdmin]);
};

export const useBackIfNotLogged = (): void => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [user]);
};

export const useAvailablePlacesForSlots = async (
  weekId: string | undefined,
): Promise<any> => {
  const { slotsData, setSlotsData } = useContext(AppContext);
  if (!weekId) {
    return;
  }
  const weeksDoc = await db.collection('weeks').doc(weekId).get();
  if (!weeksDoc.exists) {
    return;
  }
  const weeksRaw = weeksDoc.data();
  db.collection('registrations')
    .where('weekId', '==', weekId)
    .onSnapshot((registrationsDocs: any) => {
      const registrations: RegisteredUser[] = [];
      registrationsDocs.forEach((registrationDoc: any) => {
        registrations.push({
          id: registrationDoc.id,
          ...registrationDoc.data(),
        });
      });
      const slots: FixedSlotData[] = weeksRaw?.slots.map((slot: SlotData) => ({
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
      }));
      if (!deepEqual(slots, slotsData)) {
        setSlotsData(slots);
      }
    }, errorHandler);
};

export const useUsersRegistration = async (
  email: string | undefined,
  weekId: string | undefined,
): Promise<any> => {
  const { usersRegistration, setUsersRegistration } = useContext(AppContext);

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
  }, [weekId, email]);
};

export const usePreregisteredEmails = (): void => {
  const { setPreregistrationEmails } = useContext(AppContext);
  const isAdmin = useIsUserAdmin();

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    const docRef = db.collection('options').doc('preregistration');
    docRef
      .get()
      .then((preregistrationDoc: any) => {
        if (!preregistrationDoc.exists) {
          return;
        }
        const preregistration = preregistrationDoc.data();
        setPreregistrationEmails(preregistration?.emails ?? []);
      })
      .catch(errorHandler);
  }, []);
};

export const useCanUserPreregister = (): void => {
  const { user, setCanPreregister } = useContext(AppContext);

  useEffect(() => {
    const docRef = db.collection('options').doc('preregistration');
    docRef
      .get()
      .then((preregistrationDoc: any) => {
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
  }, []);
};
