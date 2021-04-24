import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '.';
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

export default useFirebaseAuthentication;
