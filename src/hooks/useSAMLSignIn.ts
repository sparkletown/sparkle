import { useCallback } from "react";
import get from "lodash/get";
import Bugsnag from "@bugsnag/js";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";

import { isDefined } from "utils/types";

// TODO: Move to a type file
export type Mapping = { name: string; path: string };

// TODO: Fetch from backend
export const SAMLMappings: Mapping[] = [
  { name: "partyName", path: "result....." },
];

// TODO: Move to utils
export const applyMappings = (mappings: Mapping[], source: Object) =>
  mappings.reduce((acc, mapping) => {
    const mappingValue = get(source, mapping.path);

    if (isDefined(mappingValue))
      return { ...acc, [mapping.name]: mappingValue };

    return acc;
  });
export interface UseSAMLSignInProps {
  samlAuthProviderId?: string;
  showLoginLoading?: () => void;
  hideLoginLoading?: () => void;
}

export interface UseSAMLSignInReturn {
  hasSamlAuthProviderId: boolean;
  signInWithSAML: () => void;
}

export const useSAMLSignIn: ReactHook<
  UseSAMLSignInProps,
  UseSAMLSignInReturn
> = ({ samlAuthProviderId, showLoginLoading, hideLoginLoading }) => {
  const hasSamlAuthProviderId = samlAuthProviderId !== undefined;

  const signInWithSAML = useCallback(() => {
    if (!samlAuthProviderId) return;

    const SAMLAuthProvider = new firebase.auth.SAMLAuthProvider(
      samlAuthProviderId
    );

    if (showLoginLoading) {
      showLoginLoading();
    }

    firebase
      .auth()
      .signInWithPopup(SAMLAuthProvider)
      .then((result) => {
        // TODO: Check if user is first time user/eg. registers
        // TODO: Update his profile with available mappings
        console.log(result);
      })
      .catch((err) => {
        Bugsnag.notify(err, (event) => {
          event.addMetadata("context", {
            location: "hooks/useSAMLSignIn::signInWithSAML",
            samlAuthProviderId,
            SAMLAuthProvider,
          });
        });
        // @debt show UI error?
      })
      .finally(() => {
        if (hideLoginLoading) {
          hideLoginLoading();
        }
      });
  }, [samlAuthProviderId, showLoginLoading, hideLoginLoading]);

  return { signInWithSAML, hasSamlAuthProviderId };
};
