import { useCallback } from "react";
import firebase from "firebase/app";

export const useSAMLSignIn = (samlAuthProviderId?: string) => {
  const hasSamlAuthProviderId = samlAuthProviderId !== undefined;

  const signInWithSAML = useCallback(() => {
    if (!samlAuthProviderId) return;

    const SAMLAuthProvider = new firebase.auth.SAMLAuthProvider(
      samlAuthProviderId
    );

    firebase
      .auth()
      .signInWithPopup(SAMLAuthProvider)
      .catch((err) => console.log("error", err));
  }, [samlAuthProviderId]);

  return { signInWithSAML, hasSamlAuthProviderId };
};
