import React from 'react';

const AppContext = React.createContext({});

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const defaultValue = {};
  return (
    <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>
  );
};
export default AppContextProvider;
