import { FirebaseReducer } from "react-redux-firebase";

import { useCallback } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useDispatch } from "./useDispatch";
import { updateUserCache } from "store/actions/Cache";

import firebase from "firebase/app";

type UseUserResult = {
  user?: FirebaseReducer.AuthState;
  profile?: FirebaseReducer.Profile<User>;
  userWithId?: WithId<User>;
  userId?: string;
};

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
    userWithId: auth && profile ? { ...profile, id: auth.uid } : undefined,
    userId: auth && profile ? auth.uid : undefined,
  };
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
        const user: WithId<User> = doc.data() as WithId<User>;
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
