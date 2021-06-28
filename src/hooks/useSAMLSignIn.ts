import { useCallback } from "react";
import Bugsnag from "@bugsnag/js";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";

export interface UseSAMLSignInProps {
  samlAuthProviderId?: string;
}

export interface UseSAMLSignInReturn {
  hasSamlAuthProviderId: boolean;
  signInWithSAML: () => void;
}

export const useSAMLSignIn: ReactHook<
  UseSAMLSignInProps,
  UseSAMLSignInReturn
> = ({ samlAuthProviderId }) => {
  const hasSamlAuthProviderId = samlAuthProviderId !== undefined;

  const signInWithSAML = useCallback(() => {
    if (!samlAuthProviderId) return;

    const SAMLAuthProvider = new firebase.auth.SAMLAuthProvider(
      samlAuthProviderId
    );

    firebase
      .auth()
      .signInWithPopup(SAMLAuthProvider)
      .catch((err) => {
        Bugsnag.notify(err, (event) => {
          event.addMetadata("context", {
            location: "hooks/useSAMLSignIn::signInWithSAML",
            samlAuthProviderId,
            SAMLAuthProvider,
          });
        });
        // @debt show UI error?
      });
  }, [samlAuthProviderId]);

  return { signInWithSAML, hasSamlAuthProviderId };
};
