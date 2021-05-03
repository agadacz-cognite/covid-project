import { useEffect, useContext } from 'react';
import { AppContext } from '../';
import { db } from '../../firebase';
import { errorHandler } from '../../shared';

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
  }, [user]);
};
