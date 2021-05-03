import { useEffect, useContext } from 'react';
import { AppContext } from '../';
import { db } from '../../firebase';
import { errorHandler } from '../../shared';
import { useIsUserAdmin } from '.';

/**
 * Prepares list of the emails which are allowed to preregister.
 * @returns
 */
export const usePreregisteredEmails = (): void => {
  const { setPreregistrationEmails, isUserAdmin } = useContext(AppContext);
  useIsUserAdmin();

  useEffect(() => {
    if (!isUserAdmin) {
      return;
    }
    const docRef = db.collection('options').doc('preregistration');
    docRef
      .get()
      .then((preregistrationDoc: any) => {
        if (preregistrationDoc.exists) {
          const preregistration = preregistrationDoc.data();
          setPreregistrationEmails(preregistration?.emails ?? []);
        }
      })
      .catch(errorHandler);
  }, []);
};
