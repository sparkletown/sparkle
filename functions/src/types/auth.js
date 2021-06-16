const yup = require("yup");

const AuthConfigSchema = yup.object().shape({
  clientId: yup.string().required(),
  clientSecret: yup.string().required(),
  tokenHost: yup.string().required(),
  tokenPath: yup.string(),
  revokePath: yup.string(),
  authorizeHost: yup.string(),
  authorizePath: yup.string(),
});

exports.AuthConfigSchema = AuthConfigSchema;
