const oauth2 = require("simple-oauth2");

/**
 * Create a configured simple-oauth2 client.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#createoptions--module
 */
const createOAuth2Client = async ({
  clientId,
  clientSecret,
  tokenHost,
  tokenPath,
  revokePath,
  authorizeHost,
  authorizePath,
}) => {
  const credentials = {
    client: {
      id: clientId,
      secret: clientSecret,
    },
    auth: {
      tokenHost,
      tokenPath,
      revokePath,
      authorizeHost,
      authorizePath,
    },
  };

  return oauth2.create(credentials);
};

exports.createOAuth2Client = createOAuth2Client;
