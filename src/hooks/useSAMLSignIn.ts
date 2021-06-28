import { useCallback } from "react";
import Bugsnag from "@bugsnag/js";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";
import { Mappings } from "types/User";

import { setLocalStorageItem, LocalStorageItem } from "utils/localStorage";
import { getMappedValues } from "utils/profile";

export interface UseSAMLSignInProps {
  samlAuthProviderId?: string;
  samlProfileMappings?: Mappings;
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

        const mappedProfileData = getMappedValues(samlProfileMappings, result);

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
