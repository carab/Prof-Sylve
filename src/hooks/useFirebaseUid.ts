import { useState, useEffect } from 'react';
import firebase from 'utils/firebase';

function useFirebaseUid(username: string | undefined) {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    setUid(undefined);
    setError(undefined);

    if (!username) {
      return;
    }

    const ref = firebase.database().ref().child(`username_lookup/${username}`);

    const onValueChange = ref.on(
      'value',
      (snapshot) => {
        const uid = snapshot.val();

        if (uid) {
          setUid(uid);
        } else {
          setError(new Error('Username was not found.'));
        }
      },
      (error: Error) => {
        setError(error);
      },
    );

    return () => {
      ref.off('value', onValueChange);
    };
  }, [username]);

  return [uid, error];
}

export default useFirebaseUid;
