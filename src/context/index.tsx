import React, { useState } from 'react';
import { RegistrationData } from '../shared';

type ContextType = {
  user: any;
  days: string[];
  activeRegistration: RegistrationData | undefined;
  setUser: (user: any) => void;
  setDays: (days: string[]) => void;
  setActiveRegistration: (week: RegistrationData | undefined) => void;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [user, setUser] = useState();
  const [days, setDays] = useState<string[]>([]);
  const [activeRegistration, setActiveRegistration] = useState<
    RegistrationData | undefined
  >();

  const value = {
    user,
    setUser,
    days,
    setDays,
    activeRegistration,
    setActiveRegistration,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
export * from './hooks';
