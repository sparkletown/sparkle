import { useCallback } from "react";
import firebase from "firebase/app";

export const useSSO = (SAMLConfigId?: string) => {
  const signInSSO = useCallback(() => {
    if (!SAMLConfigId) return;

    const SSOProvider = new firebase.auth.SAMLAuthProvider(SAMLConfigId);

    firebase
      .auth()
      .signInWithPopup(SSOProvider)
      .catch((err) => console.log("error", err));
  }, [SAMLConfigId]);

  return {
    signInSSO,
  };
};
