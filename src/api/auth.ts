import Bugsnag from "@bugsnag/js";
import firebase from "firebase/compat/app";

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
  firebase.functions().httpsCallable("access-checkIsEmailWhitelisted")(data);

export interface CheckIsCodeValid {
  venueId: string;
  code: string;
}

export const checkIsCodeValid = async (data: CheckIsCodeValid) =>
  firebase.functions().httpsCallable("access-checkIsCodeValid")(data);

export const checkAccess = async (data: CheckAccessTypes) =>
  firebase.functions().httpsCallable("access-checkAccess")(data);

export interface CustomAuthConfig {
  customAuthName: string;
  customAuthConnectPath: string;
}

export const fetchCustomAuthConfig = async (
  venueId: string
): Promise<CustomAuthConfig> =>
  await firebase
    .functions()
    .httpsCallable("auth-getCustomAuthConfig")({ venueId })
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
