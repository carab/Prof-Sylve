import { useState, useEffect } from 'react';
import firebase from 'utils/firebase';
import { nanoid } from 'nanoid';

export type ProfileModel = {
  username?: string;
};

function useFirebaseProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<ProfileModel | undefined | null>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    setProfile(undefined);
    setError(undefined);

    if (!uid) {
      return;
    }

    const ref = firebase.database().ref().child(`users/${uid}/profile`);

    const onValueChange = ref.on(
      'value',
      (snapshot) => {
        const profile: ProfileModel | null = snapshot.val() ?? null;

        setProfile(profile);
      },
      (error: Error) => {
        setError(error);
      },
    );

    return () => {
      ref.off('value', onValueChange);
    };
  }, [uid]);

  // Initialize or add missing data
  useEffect(() => {
    if (profile === undefined) {
      // Undefined means it was not yet loaded so nothing to do
      return;
    }

    // Username was not found
    if (!profile?.username) {
      // Generate random username, retry if it was already used (almost impossible)
      const setUsername = async () => {
        const username = nanoid();

        try {
          await firebase.database().ref().child(`username_lookup/${username}`).set(uid);
          await firebase.database().ref().child(`users/${uid}/profile/username`).set(username);
        } catch (error) {
          setUsername();
        }
      };

      setUsername();
    }
  }, [profile, uid]);

  return [profile, error];
}

export default useFirebaseProfile;
