import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../';

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
