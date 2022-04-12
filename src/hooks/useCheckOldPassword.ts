import { useCallback } from "react";
import firebase from "firebase/compat/app";

import { useLiveUser } from "hooks/user/useLiveUser";

export const useCheckOldPassword = () => {
  const { user } = useLiveUser();
  const email = user?.email;

  return useCallback(
    async (oldPassword: string) => {
      if (!email) return;

      try {
        await firebase.auth().signInWithEmailAndPassword(email, oldPassword);
        return true;
      } catch {
        return false;
      }
    },
    [email]
  );
};
