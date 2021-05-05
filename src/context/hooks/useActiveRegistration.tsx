import { useEffect, useContext } from 'react';
import deepEqual from 'deep-equal';
import { AppContext } from '../';
import { db } from '../../firebase';
import {
  errorHandler,
  RegistrationData,
  activeRegistrationDevOrProd,
} from '../../shared';

/**
 * Retrieves fresh data about active registration straight from database.
 */
export const useActiveRegistration = (): void => {
  const { activeRegistration, setActiveRegistration } = useContext(AppContext);

  useEffect(() => {
    const activeRegistrationRef = db
      .collection('options')
      .doc(activeRegistrationDevOrProd);
    let unsubscribeWeeks: any;
    const unsubscribeActiveRegistration = activeRegistrationRef.onSnapshot(
      option => {
        if (!option.exists) {
          setActiveRegistration(undefined);
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
