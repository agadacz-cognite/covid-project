import React, { useState } from 'react';

type Days = {
  firstHalf: boolean;
  secondHalf: boolean;
};
type ContextType = {
  user: any;
  days: Days;
  setUser: (user: any) => void;
  setDays: ({ firstHalf, secondHalf }: Days) => void;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [user, setUser] = useState();
  const [days, setDays] = useState({ firstHalf: false, secondHalf: false });

  const value = {
    user,
    setUser,
    days,
    setDays,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
