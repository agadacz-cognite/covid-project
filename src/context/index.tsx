import React, { useState } from 'react';
import { RegistrationData, FixedSlotData, RegisteredUser } from '../shared';

type ContextType = {
  loading: boolean;
  gapiLoaded: boolean;
  user: any;
  isUserAdmin: boolean;
  activeRegistration: RegistrationData | undefined;
  usersRegistration: RegisteredUser | undefined;
  slotsData: FixedSlotData[];
  preregistrationEmails: string[];
  canPreregister: boolean;
  previousWeeks: RegistrationData[] | undefined;
  setLoading: (loading: boolean) => void;
  setGapiLoaded: (gapi: boolean) => void;
  setUser: (user: any) => void;
  setIsUserAdmin: (isUserAdmin: boolean) => void;
  setActiveRegistration: (week: RegistrationData | undefined) => void;
  setUsersRegistration: (user: RegisteredUser | undefined) => void;
  setSlotsData: (slots: FixedSlotData[]) => void;
  setPreregistrationEmails: (emails: string[]) => void;
  setCanPreregister: (canPreregister: boolean) => void;
  setPreviousWeeks: (previousWeeks: RegistrationData[] | undefined) => void;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [user, setUser] = useState();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [days, setDays] = useState<string[]>([]);
  const [slotsData, setSlotsData] = useState<any[]>([]);
  const [usersRegistration, setUsersRegistration] = useState<
    RegisteredUser | undefined
  >();
  const [activeRegistration, setActiveRegistration] = useState<
    RegistrationData | undefined
  >();
  const [preregistrationEmails, setPreregistrationEmails] = useState<string[]>(
    [],
  );
  const [canPreregister, setCanPreregister] = useState(false);
  const [previousWeeks, setPreviousWeeks] = useState<
    RegistrationData[] | undefined
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
    isUserAdmin,
    setIsUserAdmin,
    activeRegistration,
    setActiveRegistration,
    usersRegistration,
    setUsersRegistration,
    slotsData,
    setSlotsData,
    preregistrationEmails,
    setPreregistrationEmails,
    canPreregister,
    setCanPreregister,
    previousWeeks,
    setPreviousWeeks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
export * from './hooks';
