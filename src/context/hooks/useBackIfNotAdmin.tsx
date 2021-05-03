import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../context';
import { useIsUserAdmin } from '.';

/**
 * Redirects user to the main page if they do not have admin permissions.
 */
export const useBackIfNotAdmin = (): void => {
  const { isUserAdmin } = useContext(AppContext);
  const history = useHistory();

  useIsUserAdmin();

  useEffect(() => {
    if (!isUserAdmin) {
      history.push('/start');
    }
  }, [isUserAdmin]);
};
