import React, { useState } from 'react';
import { RegistrationData, FixedSlotData } from '../shared';

type ContextType = {
  user: any;
  days: string[];
  admins: string[];
  activeRegistration: RegistrationData | undefined;
  slotsData: FixedSlotData[];
  setUser: (user: any) => void;
  setDays: (days: string[]) => void;
  setAdmins: (admins: string[]) => void;
  setActiveRegistration: (week: RegistrationData | undefined) => void;
  setSlotsData: (slots: FixedSlotData[]) => void;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [user, setUser] = useState();
  const [admins, setAdmins] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [slotsData, setSlotsData] = useState<any[]>([]);
  const [activeRegistration, setActiveRegistration] = useState<
    RegistrationData | undefined
  >();

  const value = {
    user,
    setUser,
    days,
    setDays,
    admins,
    setAdmins,
    activeRegistration,
    setActiveRegistration,
    slotsData,
    setSlotsData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
export * from './hooks';
