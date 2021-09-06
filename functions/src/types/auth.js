const { isValidUrl } = require("../utils/url");

const yup = require("yup");

// TODO: should we nest these different subsets of keys?
const AuthConfigSchema = yup.object().shape({
  // OAuth
  clientId: yup.string().required(),
  clientSecret: yup.string().required(),
  tokenHost: yup.string().required(),
  tokenPath: yup.string(),
  revokePath: yup.string(),
  authorizeHost: yup.string(),
  authorizePath: yup.string(),
  scope: yup.lazy((val) =>
    Array.isArray(val) ? yup.array().of(yup.string()) : yup.string().default("")
  ),

  // Sparkle Platform Specific
  customAuthName: yup.string().required(),
  customAuthConnectPath: yup.string().required(),
  validReturnOrigins: yup
    .array()
    .of(
      // eslint-disable-next-line no-template-curly-in-string -- This is how yup specifies it's placeholders
      yup.string().test("isValidUrl", "${path} is not a valid url", isValidUrl)
    )
    .default([]),

  // I4A
  // @debt This is required for the current I4A implementation, but in future we should refactor this schema be more generic
  i4aApiKey: yup.string().required(),
  i4aOAuthUserInfoUrl: yup.string().required(),
  i4aGetUserMeetingInfoUrl: yup.string().required(),
  i4aMeetingIdsToCheck: yup.array().of(yup.number()).default([]),
  i4aEventIdsToCheck: yup.array().of(yup.number()).default([]),
});

exports.AuthConfigSchema = AuthConfigSchema;
