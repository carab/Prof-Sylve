import React, { useState, useMemo } from 'react';

export type AppbarContextType = {
  secondary?: boolean;
  setSecondary(secondary?: boolean): void;
  appbarEl?: Element;
  setAppbarEl(appbarEl?: Element): void;
};

export const AppbarContext = React.createContext<AppbarContextType>({
  secondary: undefined,
  setSecondary: () => {},
  appbarEl: undefined,
  setAppbarEl: () => {},
});

export type AppbarContextProviderProps = {
  children: React.ReactNode;
};

export function AppbarContextProvider({ children }: AppbarContextProviderProps) {
  const [appbarEl, setAppbarEl] = useState<AppbarContextType['appbarEl']>(undefined);
  const [secondary, setSecondary] = useState<AppbarContextType['secondary']>(undefined);

  const value: AppbarContextType = useMemo((): AppbarContextType => {
    return {
      secondary,
      setSecondary,
      appbarEl,
      setAppbarEl,
    };
  }, [appbarEl, secondary]);

  return <AppbarContext.Provider value={value}>{children}</AppbarContext.Provider>;
}
