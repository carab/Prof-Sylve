import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/utils/Loader/Loader';
import actions from 'actions';
import { selectAuth } from 'selectors/selectors';
import useFirebaseProfile from 'hooks/useFirebaseProfile';

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, ready } = useSelector(selectAuth);

  // Listens to auth changes
  useEffect(() => {
    dispatch(actions.auth.startAuth());

    return () => {
      dispatch(actions.auth.stopAuth());
    };
  }, [dispatch]);

  // Listens to profile changes
  const [profile] = useFirebaseProfile(user?.uid);
  useEffect(() => {
    dispatch(actions.profile.setProfile(profile));
  }, [dispatch, profile]);

  // Sets UI locale from profile
  const locale = profile?.locale;
  useEffect(() => {
    if (locale) {
      dispatch(actions.ui.setLocale(locale));
    }
  }, [dispatch, locale]);

  if (ready) {
    return children;
  }

  return (
    <div className="Splash">
      <Loader />
    </div>
  );
}

export default AuthProvider;
