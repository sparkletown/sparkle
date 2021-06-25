import { useCallback } from "react";
import get from "lodash/get";
import Bugsnag from "@bugsnag/js";

import firebase from "firebase/app";

import { ReactHook } from "types/utility";
import { Mapping } from "types/User";

import { isDefined } from "utils/types";

// TODO: Move to a type file

// TODO: Fetch from backend
export const SAMLMappings: Mapping[] = [
  { name: "partyName", path: "additionalUserInfo.profile.githubName" },
  { name: "companyTitle", path: "additionalUserInfo.profile.title" },
  { name: "companyDepartment", path: "additionalUserInfo.profile.department" },
  { name: "firstName", path: "additionalUserInfo.profile.githubName" },
  { name: "lastName", path: "additionalUserInfo.profile.title" },
];

// TODO: Move to utils
export const applyMappings = (mappings: Mapping[], source: Object) =>
  mappings.reduce((acc, mapping) => {
    const mappingValue: string = get(source, mapping.path);

    console.log({ mapping, mappingValue });

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
        if (!result.additionalUserInfo?.isNewUser || !result.user?.uid) return;

        const mappingValues = applyMappings(SAMLMappings, result);
        sessionStorage.setItem("profileData", JSON.stringify(mappingValues));
        console.log(result, mappingValues);
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
