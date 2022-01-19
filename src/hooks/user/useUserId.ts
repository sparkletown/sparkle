import { useEffect, useMemo, useState } from "react";
import { useAuth } from "reactfire";

import { UserId } from "types/id";
import { FireAuthUser } from "types/reactfire";

export const useUserId = () => {
  const auth = useAuth();
  const [authUser, setAuthUser] = useState<FireAuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const userId = authUser?.uid as UserId;

  useEffect(
    () =>
      auth.onAuthStateChanged(
        () => {
          setAuthUser(auth.currentUser);
          setLoading(false);
        },
        setError,
        () => setLoading(false)
      ),
    [auth]
  );

  return useMemo(
    () => ({
      userId,
      auth: authUser,
      isLoading: loading,
      isLoaded: !loading,
      error,
    }),
    [userId, authUser, loading, error]
  );
};
