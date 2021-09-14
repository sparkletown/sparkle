import React, { useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsyncFn } from "react-use";
import { FalseyValue } from "styled-components";

import { User } from "types/User";

import { WithId, withId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import "components/organisms/NewProfileModal/components/ProfileModalFetchUser/ProfileModalFetchUser.scss";

export interface ProfileModalUserLoadingProps {
  userId: string | undefined;
  children: (
    user: WithId<User>,
    refreshUser: () => Promise<void>
  ) => React.ReactElement | FalseyValue | "";
}

export const ProfileModalFetchUser: React.FC<ProfileModalUserLoadingProps> = ({
  userId,
  children,
}: ProfileModalUserLoadingProps) => {
  const firebase = useFirebase();

  const [fetchUserState, fetchUser] = useAsyncFn(
    async () => {
      if (!userId) return;
      const firestore = firebase.firestore();
      const userDoc = await firestore.collection("users").doc(userId).get();

      const user = userDoc.data() as User;
      return withId(user, userId);
    },
    [firebase, userId],
    { loading: true }
  );

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  // a separate promise state here no to show spinner on profile save
  const [refreshState, refresh] = useAsyncFn(async () => {
    await fetchUser();
  });

  return (
    <>
      {fetchUserState.value &&
      (refreshState.loading ||
        (!fetchUserState.loading && !fetchUserState.error)) ? (
        <>{children(fetchUserState.value, refresh)}</>
      ) : (
        <div className="ProfileModalFetchUser">
          {fetchUserState.loading ? (
            <Loading />
          ) : (
            fetchUserState.error ||
            (!fetchUserState.value && (
              <div>
                Oops, an error occurred while trying to load user data.{"\n"}
                Please contact our support team.
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};
