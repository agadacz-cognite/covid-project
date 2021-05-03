import { useEffect, useContext } from 'react';
import { notification } from 'antd';
import deepEqual from 'deep-equal';
import { AppContext } from '../';
import { db } from '../../firebase';
import { errorHandler, RegistrationData } from '../../shared';

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