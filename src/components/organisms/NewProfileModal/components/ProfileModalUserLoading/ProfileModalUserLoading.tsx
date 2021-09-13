import React, { useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsyncFn } from "react-use";
import { FalseyValue } from "styled-components";

import { User } from "types/User";

import { WithId, withId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import "./ProfileModalUserLoading.scss";

export interface ProfileModalUserLoadingProps {
  userId: string | undefined;
  render: (
    user: WithId<User>,
    refreshUser: () => Promise<void>
  ) => React.ReactElement | FalseyValue | "";
}

export const ProfileModalUserLoading: React.FC<ProfileModalUserLoadingProps> = ({
  userId,
  render,
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

  return (
    <>
      {!fetchUserState.loading &&
      !fetchUserState.error &&
      fetchUserState.value ? (
        <>{render(fetchUserState.value, fetchUser as () => Promise<void>)}</>
      ) : (
        <div className={"ProfileModalUserLoading"}>
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
