import { useCallback } from "react";
import firebase from "firebase/app";

import { SSO_PROVIDER_ID } from "secrets";

export const useSSO = () => {
  const hasSSOProvider = SSO_PROVIDER_ID !== undefined;

  const signInSSO = useCallback(() => {
    if (!SSO_PROVIDER_ID) return;

    const SSOProvider = new firebase.auth.SAMLAuthProvider(SSO_PROVIDER_ID);

    firebase
      .auth()
      .signInWithPopup(SSOProvider)
      .catch((err) => console.log("error", err));
  }, []);

  return {
    signInSSO,
    hasSSOProvider,
  };
};
