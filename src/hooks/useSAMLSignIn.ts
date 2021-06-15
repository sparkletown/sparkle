import { useCallback } from "react";
import firebase from "firebase/app";

export const useSAMLSignIn = (SAMLConfigId?: string) => {
  const signInWithSAML = useCallback(() => {
    if (!SAMLConfigId) return;

    const SAMLAuthProvider = new firebase.auth.SAMLAuthProvider(SAMLConfigId);

    firebase
      .auth()
      .signInWithPopup(SAMLAuthProvider)
      .catch((err) => console.log("error", err));
  }, [SAMLConfigId]);

  return { signInWithSAML };
};
