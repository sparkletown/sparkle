import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

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

export interface AddEmailsToWhitelist {
  venueId: string;
  emails: string[];
}

export interface GetWhitelistedEmails {
  venueId: string;
}

export interface RemoveEmailFromWhitelist {
  venueId: string;
  email: string;
}

export const checkIsEmailWhitelisted = async (data: CheckIsEmailWhitelisted) =>
  await firebase.functions().httpsCallable("access-checkIsEmailWhitelisted")(
    data
  );

export const addEmailsToWhitelist = async (data: AddEmailsToWhitelist) =>
  await firebase.functions().httpsCallable("access-addEmailsToWhitelist")(data);

export const getWhitelistedEmails = async (data: GetWhitelistedEmails) =>
  await firebase.functions().httpsCallable("access-getWhitelistedEmails")(data);

export const removeEmailFromWhitelist = async (
  data: RemoveEmailFromWhitelist
) =>
  await firebase.functions().httpsCallable("access-removeEmailFromWhitelist")(
    data
  );

export const checkAccess = async (data: CheckAccessTypes) =>
  await firebase.functions().httpsCallable("access-checkAccess")(data);

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
