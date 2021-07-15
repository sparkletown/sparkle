import { useMemo, useCallback } from "react";
import { FirebaseReducer } from "react-redux-firebase";
import { isEqual } from "lodash";

import { User, UserWithLocation } from "types/User";

import { withId, WithId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { useDispatch } from "./useDispatch";
import { updateUserCache } from "store/actions/Cache";

import firebase from "firebase/app";

export interface UseUserResult {
  user?: FirebaseReducer.AuthState;
  profile?: FirebaseReducer.Profile<User>;
  userWithId?: WithId<User>;
  userId?: string;
}

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector, isEqual);
  const profile = useSelector(profileSelector, isEqual);

  return useMemo(
    () => ({
      user: !auth.isEmpty ? auth : undefined,
      profile: !profile.isEmpty ? profile : undefined,
      userWithId: auth && profile ? withId(profile, auth.uid) : undefined,
      userId: auth && profile ? auth.uid : undefined,
    }),
    [auth, profile]
  );
};

export const useUserInvalidateCache = (id: string | undefined) => {
  const dispatch = useDispatch();

  const invalidateUserCache = useCallback(() => {
    if (!id) return;
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .get()
      .then((doc: firebase.firestore.DocumentSnapshot) => {
        const user: WithId<UserWithLocation> = doc.data() as WithId<UserWithLocation>;
        user.id = doc.id;
        //state.usersRecord[doc.id] = user;
        //state.usersArray = Object.values(state.usersRecord);
        console.log("got invalidated result", user.data);
        dispatch(updateUserCache(id, user));
      });
  }, [id, dispatch]);

  return {
    invalidateUserCache,
  };
};
