import { useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { errorHandler, RegistrationData } from '../../shared';
import { AppContext } from '../';

/**
 * Gets the data of the old, already inactive registrations
 */
export const usePreviousWeeks = (): void => {
  const { previousWeeks, setPreviousWeeks } = useContext(AppContext);

  useEffect(() => {
    if (previousWeeks) {
      return;
    }
    db.collection('weeks')
      .get()
      .then((weeksRaw: any) => {
        const weeks = (weeksRaw.docs.map((week: any) =>
          week.data(),
        ) as unknown) as RegistrationData[];
        setPreviousWeeks(weeks);
      })
      .catch(errorHandler);
  }, []);
};
