import { useContext } from 'react';
import { AppbarContextType, AppbarContext } from './AppbarContextProvider';

function useAppbarContext(): AppbarContextType {
  return useContext(AppbarContext);
}

export default useAppbarContext;
