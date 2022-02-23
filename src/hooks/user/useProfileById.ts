import { useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";

import { COLLECTION_USERS } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

type UseProfileById = (options: {
  userId: string;
}) => {
  isLoading: boolean;
  isLoaded: boolean;
  status: "success" | "loading" | "error";
  error: Error | undefined;
  profile?: WithId<User>;
  userId?: string;
  isTester: boolean;
};

export const useProfileById: UseProfileById = ({ userId }) => {
  const firestore = useFirestore();

  const userRef = firestore.collection(COLLECTION_USERS).doc(userId);

  const { data: profile, status, error } = useFirestoreDocData<WithId<User>>(
    userRef
  );

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);

  return useMemo(
    () => ({
      profile,
      userId,
      isTester,
      isLoading: status === "loading",
      isLoaded: status === "success",
      status,
      error,
    }),
    [profile, userId, isTester, status, error]
  );
};
