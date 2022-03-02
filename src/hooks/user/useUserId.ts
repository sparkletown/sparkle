import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { FireAuthUser } from "types/fire";
import { UserId } from "types/id";

type WorkaroundSetter = (
  newAuthUser: FireAuthUser | null
) => (oldAuthUser: FireAuthUser | null) => FireAuthUser | null;

const workaroundSetter: WorkaroundSetter = (newAuthUser) => (oldAuthUser) => {
  // the user has logged out, time for a workaround
  if (oldAuthUser && !newAuthUser) {
    // Firestore SDK bug on re-login:  insufficient permissions' error because of old observers
    // reloading the page clears the SDK cached observers attached to the window itself
    // this prevents the error on the next login since we're starting fresh
    window.location.reload();
  }
  return newAuthUser;
};

export const useUserId = () => {
  // @see https://firebase.google.com/docs/auth/web/start
  // @see https://firebase.google.com/docs/reference/js/firebase.User
  const [authUser, setAuthUser] = useState<FireAuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const setLoaded = useCallback(() => setLoading(false), []);

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (usr) => {
        if (!isMounted) return;
        setAuthUser(workaroundSetter(usr));
        setLoaded();
      },
      (err) => {
        if (!isMounted) return;
        setError(err);
        setLoaded();
      }
    );

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [setLoaded]);

  return useMemo(
    () => ({
      userId: authUser?.uid as UserId,
      auth: authUser,
      isLoading: loading,
      isLoaded: !loading,
      error,
    }),
    [authUser, loading, error]
  );
};
