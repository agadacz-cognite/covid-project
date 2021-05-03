import { useEffect, useContext } from 'react';
import { notification } from 'antd';
import { AppContext } from '../';
import { db } from '../../firebase';

/**
 * Checks if the user has admin permissions.
 * @returns boolean
 */
export const useIsUserAdmin = (): any => {
  const { setIsUserAdmin, user } = useContext(AppContext);

  useEffect(() => {
    const adminsRef = db.collection('options').doc('admins');
    adminsRef.get().then(option => {
      if (!option.exists) {
        notification.error({
          message: 'Something went wrong.',
          description: 'Something went wrong when trying to get admins.',
        });
        setIsUserAdmin(false);
      } else {
        const emails: string[] = option.data()?.emails;
        if (emails.includes(user?.email)) {
          setIsUserAdmin(true);
        } else {
          setIsUserAdmin(false);
        }
      }
    });
  }, []);
};
