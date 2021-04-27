import React, { useState } from 'react';
import { RegistrationData, FixedSlotData, RegisteredUser } from '../shared';

type ContextType = {
  loading: boolean;
  gapiLoaded: boolean;
  user: any;
  admins: string[];
  activeRegistration: RegistrationData | undefined;
  usersRegistration: RegisteredUser | undefined;
  slotsData: FixedSlotData[];
  setLoading: (loading: boolean) => void;
  setGapiLoaded: (gapi: boolean) => void;
  setUser: (user: any) => void;
  setAdmins: (admins: string[]) => void;
  setActiveRegistration: (week: RegistrationData | undefined) => void;
  setUsersRegistration: (user: RegisteredUser | undefined) => void;
  setSlotsData: (slots: FixedSlotData[]) => void;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [user, setUser] = useState();
  const [admins, setAdmins] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [slotsData, setSlotsData] = useState<any[]>([]);
  const [usersRegistration, setUsersRegistration] = useState<
    RegisteredUser | undefined
  >();
  const [activeRegistration, setActiveRegistration] = useState<
    RegistrationData | undefined
  >();

  const value = {
    loading,
    setLoading,
    gapiLoaded,
    setGapiLoaded,
    user,
    setUser,
    days,
    setDays,
    admins,
    setAdmins,
    activeRegistration,
    setActiveRegistration,
    usersRegistration,
    setUsersRegistration,
    slotsData,
    setSlotsData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
export * from './hooks';
