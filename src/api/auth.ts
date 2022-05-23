import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

type CheckAccessTypes = {
  venueId: string;
  password?: string;
  email?: string;
  code?: string;
  token?: string;
};

export interface CheckIsEmailWhitelisted {
  venueId: string;
  email: string;
}

export const checkIsEmailWhitelisted = async (data: CheckIsEmailWhitelisted) =>
  httpsCallable(FIREBASE.functions, "access-checkIsEmailWhitelisted")(data);

export interface CheckIsCodeValid {
  venueId: string;
  code: string;
}

export const checkIsCodeValid = async (data: CheckIsCodeValid) =>
  httpsCallable(FIREBASE.functions, "access-checkIsCodeValid")(data);

export const checkAccess = async (data: CheckAccessTypes) =>
  httpsCallable(FIREBASE.functions, "access-checkAccess")(data);

export interface CustomAuthConfig {
  customAuthName: string;
  customAuthConnectPath: string;
}

export const fetchCustomAuthConfig = async (
  venueId: string
): Promise<CustomAuthConfig> =>
  await httpsCallable<{ venueId: string }, CustomAuthConfig>(
    FIREBASE.functions,
    "auth-getCustomAuthConfig"
  )({ venueId })
    .then<CustomAuthConfig>((result) => result.data)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/auth::fetchCustomAuthConfig",
          venueId,
        });
      });

      throw err;
    });

export type OnboardUserProps = {
  worldSlug: string;
};

export const onboardUser = async (data: OnboardUserProps) =>
  httpsCallable(FIREBASE.functions, "user-onboardUser")(data);
