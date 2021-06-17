const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { HttpsError } = require("firebase-functions/lib/providers/https");

const { fetchAuthConfig } = require("./src/api/auth");

const { createOAuth2Client } = require("./src/utils/auth");
const { getJson, postJson } = require("./src/utils/fetch");
const { checkIfValidVenueId } = require("./src/utils/venue");

const PROJECT_ID = functions.config().project.id;
const { origin: AUTH_ORIGIN } = functions.config().auth;

exports.checkAuth = (context) => {
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== PROJECT_ID) {
    throw new functions.https.HttpsError("permission-denied", "Token invalid");
  }
};

// Case-insensitive first character for iDevices
const lowercaseFirstChar = (password) =>
  password.charAt(0).toLowerCase() + password.substring(1);

exports.passwordsMatch = (submittedPassword, actualPassword) =>
  submittedPassword.trim() === actualPassword.trim() ||
  lowercaseFirstChar(submittedPassword.trim()) ===
    lowercaseFirstChar(actualPassword.trim());

/**
 * Redirect the user to the authentication consent screen.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#authorizeurlauthorizeoptions--string
 */
exports.connectI4AOAuth = functions.https.onRequest(async (req, res) => {
  const { venueId } = req.query;

  if (!AUTH_ORIGIN) {
    throw new HttpsError("internal", "auth.origin is not configured properly");
  }

  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError("invalid-argument", "venueId is not a valid venue id");
  }

  const authConfig = await fetchAuthConfig(venueId);

  const authClient = createOAuth2Client(authConfig);

  const { scope } = authConfig;

  const authCodeReturnUri = `${AUTH_ORIGIN}/auth/connect/i4a/handler?venueId=${venueId}`;

  const redirectUri = authClient.authorizationCode.authorizeURL({
    redirect_uri: authCodeReturnUri,
    scope,
  });

  functions.logger.log("Redirecting to:", redirectUri);
  res.redirect(redirectUri);
});

/**
 * Exchanges a given auth code passed in the 'code' URL query parameter for an access token,
 * looks up the associated I4A user's details, creates/fetches a firebase account, and then
 * finally returns a custom Firebase auth token that the frontend can use to login as this user.
 */
exports.connectI4AOAuthHandler = functions.https.onRequest(async (req, res) => {
  const { venueId, code: authCode } = req.query;

  if (!AUTH_ORIGIN) {
    throw new HttpsError("internal", "auth.origin is not configured properly");
  }

  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError("invalid-argument", "venueId is not a valid venue id");
  }

  if (!authCode) {
    throw new HttpsError("invalid-argument", "code is required");
  }

  const authConfig = await fetchAuthConfig(venueId);

  const {
    i4aApiKey,
    i4aOAuthUserInfoUrl,
    i4aGetUserMeetingInfoUrl,
  } = authConfig;

  const authClient = createOAuth2Client(authConfig);

  functions.logger.log("Received auth code:", authCode);
  const results = await authClient.authorizationCode.getToken({
    code: authCode,
    redirect_uri: "http://localhost:3000/in/foo", // TODO: what do we want to use here?
  });
  functions.logger.log("Auth code exchange result received:", results);

  const { access_token: accessToken } = results;

  // Retrieve the user's I4A User ID
  const { id: i4aUserId } = await getJson(i4aOAuthUserInfoUrl, {
    Authorization: `Bearer ${accessToken}`,
  });

  functions.logger.log("I4A User ID:", i4aUserId);

  if (!i4aUserId) {
    // TODO: redirect to some kind of '500 error' page?
    res.redirect("/in/TODO/error");
    return;
  }

  // TODO: configure this in cloud config and/or firestore or similar
  const meetingIdsToCheck = [131, 136];
  const eventIdsToCheck = [504, 506, 554];

  const checkedMeetingResult = await postJson(i4aGetUserMeetingInfoUrl, {
    apiKey: i4aApiKey,
    ams_id: i4aUserId,
  });

  functions.logger.log("Checked Meeting Result:", checkedMeetingResult);

  const {
    email: emailRaw,
    meeting_ids: meetingIds = [],
    event_ids: eventIds = [],
  } = checkedMeetingResult;

  const registeredMeetings = meetingIds.filter((meetingId) =>
    meetingIdsToCheck.includes(meetingId)
  );

  const registeredEvents = eventIds.filter((eventId) =>
    eventIdsToCheck.includes(eventId)
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

  // Create a custom token for the frontend to use to sign into firebase auth as this user
  const customToken = await admin.auth().createCustomToken(userRecord.uid, {
    registeredMeetings,
  });

  res.redirect(`${AUTH_ORIGIN}/in/${venueId}?customToken=${customToken}`);
});
