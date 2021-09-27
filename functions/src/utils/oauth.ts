import { AuthorizationCode } from "simple-oauth2";

/**
 * Create a configured simple-oauth2 client.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#createoptions--module
 */
export const createOAuth2Client = ({
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

  return new AuthorizationCode(credentials);
};
