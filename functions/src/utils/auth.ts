import { default as oauth2 } from "simple-oauth2";

interface createOAuth2ClientArgs {
  clientId: string;
  clientSecret: string;
  tokenHost: string;
  tokenPath: string;
  revokePath: string;
  authorizeHost: string;
  authorizePath: string;
}

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
}: createOAuth2ClientArgs) => {
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
