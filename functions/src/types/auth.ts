import * as Yup from "yup";
import { isValidUrl } from "../utils/url";

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  tokenHost: string;
  tokenPath: string;
  revokePath: string;
  authorizeHost: string;
  authorizePath: string;
  scope: string[];
  customAuthName: string;
  customAuthConnectPath: string;
  validReturnOrigins: string[];
  i4aApiKey: string;
  i4aOAuthUserInfoUrl: string;
  i4aGetUserMeetingInfoUrl: string;
  i4aMeetingIdsToCheck: number[];
  i4aEventIdsToCheck: number[];
}

// TODO: should we nest these different subsets of keys?
export const AuthConfigSchema = Yup.object<AuthConfig>({
  // OAuth
  clientId: Yup.string().required(),
  clientSecret: Yup.string().required(),
  tokenHost: Yup.string().required(),
  tokenPath: Yup.string(),
  revokePath: Yup.string(),
  authorizeHost: Yup.string(),
  authorizePath: Yup.string(),
  scope: Yup.lazy((val) =>
    Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string().default("")
  ),

  // Sparkle Platform Specific
  customAuthName: Yup.string().required(),
  customAuthConnectPath: Yup.string().required(),

  //@ts-ignore
  validReturnOrigins: Yup.array<string>()
    .of(
      Yup.string().test(
        "isValidUrl",
        // eslint-disable-next-line no-template-curly-in-string -- This is how yup specifies it's placeholders
        "${path} is not a valid url",
        isValidUrl
      )
    )
    .default([]),

  // I4A
  // @debt This is required for the current I4A implementation, but in future we should refactor this schema be more generic
  i4aApiKey: Yup.string().required(),
  i4aOAuthUserInfoUrl: Yup.string().required(),
  i4aGetUserMeetingInfoUrl: Yup.string().required(),
  //@ts-ignore
  i4aMeetingIdsToCheck: Yup.array().of(Yup.number()).default([]),
  //@ts-ignore
  i4aEventIdsToCheck: Yup.array().of(Yup.number()).default([]),
});
