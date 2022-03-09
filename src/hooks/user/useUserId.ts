import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { FireAuthUser } from "types/fire";
import { UserId } from "types/id";

export const useUserId = () => {
  // @see https://firebase.google.com/docs/auth/web/start
  // @see https://firebase.google.com/docs/reference/js/firebase.User
  const [authUser, setAuthUser] = useState<FireAuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const setLoaded = useCallback(() => setLoading(false), []);

  useEffect(
    () => onAuthStateChanged(getAuth(), setAuthUser, setError, setLoaded),
    [setLoaded]
  );

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
