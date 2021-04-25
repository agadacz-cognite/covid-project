import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '.';
import { db } from '../firebase';
import { notification } from 'antd';
import { errorHandler, RegistrationData } from '../shared';

import firebase from '../firebase';

export const useFirebaseAuthentication = (): any => {
  const history = useHistory();
  const { setUser } = useContext(AppContext);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((newUser: any) => {
      if (newUser) {
        setUser(newUser);
      } else {
        setUser(null);
        history.push('/');
      }
    });
  }, []);
};

export const useActiveRegistration = (): RegistrationData | undefined => {
  const { activeRegistration, setActiveRegistration } = useContext(AppContext);
  if (activeRegistration) {
    return activeRegistration;
  }
  const docRef = db.collection('options').doc('activeRegistration');
  docRef
    .get()
    .then(option => {
      if (!option.exists) {
        notification.error({
          message: 'Something went wrong.',
          description:
            'Something went wrong when trying to retrieve data of the active registration from database.',
        });
        return undefined;
      } else {
        const activeRegistration = option.data();
        const id = activeRegistration?.id;
        const weekRef = db.collection('weeks').doc(id);
        weekRef
          .get()
          .then(week => {
            if (!week.exists) {
              notification.error({
                message: 'Something went wrong.',
                description:
                  'Something went wrong when trying to retrieve active registration from database.',
              });
              return undefined;
            } else {
              const fixedWeek = week.data() as RegistrationData | undefined;
              setActiveRegistration(fixedWeek);
              return fixedWeek;
            }
          })
          .catch(errorHandler);
      }
    })
    .catch(errorHandler);
};

export const useIsUserAdmin = (): any => {
  const { admins, setAdmins, user } = useContext(AppContext);
  if (admins && user?.email) {
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

export const useBackIfNotAdmin = (): void => {
  const isAdmin = useIsUserAdmin();
  const history = useHistory();
  useEffect(() => {
    if (!isAdmin) {
      history.push('/start');
    }
  }, [isAdmin]);
};
