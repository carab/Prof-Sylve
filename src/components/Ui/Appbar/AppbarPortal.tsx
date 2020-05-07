import React, { useEffect } from 'react';
import Portal from '@material-ui/core/Portal';
import useAppbarContext from './useAppbarContext';

export type AppbarPortalProps = {
  children: React.ReactNode;
  secondary?: boolean;
};

export function AppbarPortal({ children, secondary }: AppbarPortalProps) {
  const { appbarEl, setSecondary } = useAppbarContext();

  useEffect(() => {
    setSecondary(secondary);
  }, [secondary, setSecondary]);

  if (appbarEl) {
    return <Portal container={appbarEl}>{children}</Portal>;
  }

  return null;
}
