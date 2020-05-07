import { useMemo } from 'react';
import { nanoid } from 'nanoid';

function useAutoId(defaultId?: string, prefix: string = 'id-') {
  const id = useMemo(() => {
    return defaultId ?? prefix + nanoid();
  }, [defaultId, prefix]);

  return id;
}

export default useAutoId;
