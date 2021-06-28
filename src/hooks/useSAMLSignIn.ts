import { useCallback } from "react";
import Bugsnag from "@bugsnag/js";
import { get, mapValues } from "lodash";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";

import { setLocalStorageItem, LocalStorageItem } from "utils/localStorage";

export interface UseSAMLSignInProps {
  samlAuthProviderId?: string;
  samlProfileMappings?: Partial<Record<string, string>>;
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
> = ({
  samlAuthProviderId,
  showLoginLoading,
  hideLoginLoading,
  samlProfileMappings,
}) => {
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
        if (
          !result.additionalUserInfo?.isNewUser ||
          !result.user?.uid ||
          !samlProfileMappings
        )
          return;

        const mappedProfileData = mapValues(samlProfileMappings, (path) => {
          if (!path) return;

          return get(samlProfileMappings, path, undefined);
        });

        setLocalStorageItem(
          LocalStorageItem.prefillProfileData,
          mappedProfileData
        );
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
  }, [
    samlAuthProviderId,
    samlProfileMappings,
    showLoginLoading,
    hideLoginLoading,
  ]);

  return { signInWithSAML, hasSamlAuthProviderId };
};
