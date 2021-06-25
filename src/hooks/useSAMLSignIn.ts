import { useCallback } from "react";
import get from "lodash/get";
import Bugsnag from "@bugsnag/js";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";
import { Mapping } from "types/User";

import { isDefined } from "utils/types";

// TODO: Use as an example to populate backend. Delete afterwards
export const SAMLMappings: Mapping[] = [
  { name: "partyName", path: "additionalUserInfo.profile.githubName" },
  { name: "companyTitle", path: "additionalUserInfo.profile.title" },
  { name: "companyDepartment", path: "additionalUserInfo.profile.department" },
  { name: "firstName", path: "additionalUserInfo.profile.githubName" },
  { name: "lastName", path: "additionalUserInfo.profile.title" },
];

// TODO: Move somewhere to utils
export const getMappedValues = (mappings: Mapping[], source: Object) =>
  mappings.reduce((acc, mapping) => {
    const mappingValue: string = get(source, mapping.path);

    if (!isDefined(mappingValue)) {
      return acc;
    }

    return { ...acc, [mapping.name]: mappingValue };
  }, {});
export interface UseSAMLSignInProps {
  samlAuthProviderId?: string;
  samlProfileMappings?: Mapping[];
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
        // TODO: Make a utils sessionStorage. Move PrefillProfileData into const/enum
        sessionStorage.setItem(
          "PrefillProfileData",
          JSON.stringify(mappedProfileData)
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
