import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { fetchAuthConfig } from "./src/api/auth";
import { addAdmin } from "./src/api/roles";
import { assertValidUrl, assertValidVenueId } from "./src/utils/assert";
import { createOAuth2Client } from "./src/utils/oauth";
import { getJson, postJson } from "./src/utils/fetch";

// @debt refactor lowercaseFirstChar into utils/* (or maybe remove it entirely...?)
// Case-insensitive first character for iDevices
const lowercaseFirstChar = (password: string) =>
  password.charAt(0).toLowerCase() + password.substring(1);

// @debt refactor passwordsMatch into utils/*
export const passwordsMatch = (
  submittedPassword: string,
  actualPassword: string
) =>
  submittedPassword.trim() === actualPassword.trim() ||
  lowercaseFirstChar(submittedPassword.trim()) ===
    lowercaseFirstChar(actualPassword.trim());

export const getCustomAuthConfig = functions.https.onCall(async (data) => {
  const { venueId } = data;

  assertValidVenueId(venueId, "venueId");

  return await fetchAuthConfig(venueId).catch(() => ({}));
});

type ConnecxtI4AOAuthQueryType = {
  venueId: string;
  returnOrigin: string;
  code?: string;
};

/**
 * Redirect the user to the authentication consent screen.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#authorizeurlauthorizeoptions--string
 */
export const connectI4AOAuth = functions.https.onRequest(async (req, res) => {
  const { venueId, returnOrigin } = req.query as ConnecxtI4AOAuthQueryType;

  assertValidVenueId(venueId, "venueId");
  assertValidUrl(returnOrigin, "returnOrigin");

  const authConfig = await fetchAuthConfig(venueId);

  const {
    validReturnOrigins,
    scope,
    tokenHost,
    revokePath: revokePathWithoutRedirect,
  } = authConfig;

  if (!validReturnOrigins.includes(returnOrigin)) {
    throw new HttpsError(
      "invalid-argument",
      "returnOrigin is not an allowed origin"
    );
  }

  // Construct the platform URL that the revoke endpoint will redirect back to
  const revokeReturnUrl = new URL(`/v/${venueId}`, returnOrigin).toString();
  const revokePathWithRedirectUrl = new URL(
    revokePathWithoutRedirect,
    tokenHost
  );
  revokePathWithRedirectUrl.searchParams.set("redirect_uri", revokeReturnUrl);
  const revokePath = `${revokePathWithRedirectUrl.pathname}${revokePathWithRedirectUrl.search}`;

  const authClient = createOAuth2Client({ ...authConfig, revokePath });

  // Construct the platform URL that the auth code will be returned to
  const authCodeReturnUrl = new URL("/auth/connect/i4a/handler", returnOrigin);
  authCodeReturnUrl.searchParams.set("venueId", venueId);
  authCodeReturnUrl.searchParams.set("returnOrigin", returnOrigin);

  const authorizeUrl = authClient.authorizeURL({
    redirect_uri: authCodeReturnUrl.toString(),
    scope,
  });

  functions.logger.log("Redirecting to authorize URL:", authorizeUrl);
  res.redirect(authorizeUrl);
});

type I4UserMeetingInfo = {
  email: string;
  meeting_ids: number[];
  event_ids: number[];
};

type I4UserInfo = {
  id: string;
};

/**
 * Exchanges a given auth code passed in the 'code' URL query parameter for an access token,
 * looks up the associated I4A user's details, creates/fetches a firebase account, and then
 * finally returns a custom Firebase auth token that the frontend can use to login as this user.
 */
export const connectI4AOAuthHandler = functions.https.onRequest(
  async (req, res) => {
    const {
      venueId,
      returnOrigin,
      code: authCode,
    } = req.query as ConnecxtI4AOAuthQueryType;

    assertValidVenueId(venueId, "venueId");
    assertValidUrl(returnOrigin, "returnOrigin");

    if (!authCode) {
      throw new HttpsError("invalid-argument", "code is required");
    }

    const authConfig = await fetchAuthConfig(venueId);

    const {
      validReturnOrigins,
      i4aApiKey,
      i4aOAuthUserInfoUrl,
      i4aGetUserMeetingInfoUrl,
      i4aMeetingIdsToCheck,
      i4aEventIdsToCheck,
    } = authConfig;

    if (!validReturnOrigins.includes(returnOrigin)) {
      throw new HttpsError(
        "invalid-argument",
        "returnOrigin is not an allowed origin"
      );
    }

    const authClient = createOAuth2Client(authConfig);

    functions.logger.log("Received auth code:", authCode);
    const results = await authClient.getToken({
      code: authCode,
      redirect_uri: "http://localhost:3000/in/foo", // TODO: what do we want to use here?
    });
    functions.logger.log("Auth code exchange result received:", results);

    const { access_token: accessToken } = results.token;

    // Retrieve the user's I4A User ID
    const { id: i4aUserId } = await getJson<I4UserInfo>(i4aOAuthUserInfoUrl, {
      Authorization: `Bearer ${accessToken}`,
    });

    functions.logger.log("I4A User ID:", i4aUserId);

    if (!i4aUserId) {
      throw new HttpsError("internal", "failed to retrieve i4aUserId");
    }

    const checkedMeetingResult = await postJson<I4UserMeetingInfo>(
      i4aGetUserMeetingInfoUrl,
      {
        apiKey: i4aApiKey,
        ams_id: i4aUserId,
      }
    );

    functions.logger.log("Checked Meeting Result:", checkedMeetingResult);

    const {
      email: emailRaw,
      meeting_ids: meetingIds = [],
      event_ids: eventIds = [],
    } = checkedMeetingResult;

    const registeredMeetings = meetingIds.filter((meetingId) =>
      i4aMeetingIdsToCheck.includes(meetingId)
    );

    const registeredEvents = eventIds.filter((eventId) =>
      i4aEventIdsToCheck.includes(eventId)
    );

    const isRegistered =
      registeredMeetings.length > 0 && registeredEvents.length > 0;

    functions.logger.log("Registered:", {
      isRegistered,
      registeredMeetings,
      registeredEvents,
    });

    if (!isRegistered || !emailRaw) {
      // TODO: redirect to some kind of 'not allowed' page
      res.redirect("/in/TODO/not-registered");
      return;
    }

    const email = emailRaw.toLowerCase().trim();

    // Lookup the existing user by their email, or create them if they don't already exist
    const userRecord = await admin
      .auth()
      .getUserByEmail(email)
      .catch((error) => {
        // If user doesn't exist then create them
        if (error.code === "auth/user-not-found") {
          functions.logger.log(
            "Existing user not found, creating new user:",
            email
          );

          // We explicitly don't set a password here, which should prevent signing in that way (until the user resets their password to create one)
          // We also explicitly aren't creating the user's profile here, which will let them configure it in the normal way when they first sign in
          return admin.auth().createUser({ email });
        }
        throw error;
      });

    functions.logger.log("User:", {
      i4aUserId,
      userId: userRecord.uid,
      email: userRecord.email,
    });

    // Set custom claims on the user based on their registered meetings/events
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      i4aUserId,
      registeredMeetings,
      registeredEvents,
    });

    // Create a custom token for the frontend to use to sign into firebase auth as this user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Construct the platform URL that the custom token will be returned to
    const customTokenReturnUrl = new URL(
      `/login/${venueId}/${customToken}`,
      returnOrigin
    );

    functions.logger.log(
      "Redirecting back to platform with custom token:",
      customTokenReturnUrl
    );

    res.redirect(customTokenReturnUrl.toString());
  }
);

/** Automatically make user admin upon register.
 *
 *  A function that triggers when a Firebase user is created, not on https request
 *
 *  Firebase accounts will trigger user creation events for Cloud Functions when:
 *    - A user creates an email account and password.
 *    - A user signs in for the first time using a federated identity provider.
 *    - The developer creates an account using the Firebase Admin SDK.
 *    - A user signs in to a new anonymous auth session for the first time.
 *
 *  NOTE: A Cloud Functions event is not triggered when a user signs in for the first time using a custom token.
 *
 *  @see https://firebase.google.com/docs/functions/auth-events
 */
export const autoAdminOnRegister = functions.auth
  .user()
  .onCreate(async (user) => {
    const flag = functions.config().flag || {};

    if (flag.autoadmin) {
      functions.logger.log(
        "flag.autoadmin is",
        flag.autoadmin,
        "adding user.uid",
        user.uid,
        "with email",
        user.email,
        "to the admin role"
      );

      await addAdmin(user.uid);
    }
  });
