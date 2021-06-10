const functions = require("firebase-functions");
const admin = require("firebase-admin");

const oauth2 = require("simple-oauth2");
const fetch = require("node-fetch");

const PROJECT_ID = functions.config().project.id;

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

// Ref: https://firebase.google.com/docs/functions/callable-reference

// TODO: References/implementation notes/etc
//   https://github.com/lelylan/simple-oauth2
//     Needed for node < v12: https://github.com/lelylan/simple-oauth2/tree/3.x
//   OAuth example: https://github.com/firebase/functions-samples/blob/master/instagram-auth/functions/index.js
//   While the example seems to use cookies, not sure that we can by default, as per:
//     https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
//     Official docs: https://firebase.google.com/docs/hosting/manage-cache#using_cookies
//     https://firebase.google.com/docs/hosting/manage-cache#set_cache-control
//   There seems to be a fix about this mentioned in https://github.com/firebase/functions-samples/pull/852

/**
 * Creates a configured simple-oauth2 client.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#authorizeurlauthorizeoptions--string
 */
const createOAuth2Client = () => {
  // TODO: configure these creds in cloud config and/or firestore or similar
  const credentials = {
    client: {
      id: "TODO", // TODO
      secret: "TODO", // TODO
    },
    auth: {
      tokenHost: "TODO", // TODO
      tokenPath: "TODO", // TODO
      revokePath: "TODO", // TODO
      authorizePath: "TODO", // TODO
    },
  };

  return oauth2.create(credentials);
};

/**
 * Redirect the user to the authentication consent screen. The 'state' cookie is set for later state verification.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#authorizeurlauthorizeoptions--string
 */
// TODO: rename this authorize or similar?
exports.oauth2Redirect = functions.https.onRequest((req, res) => {
  // TODO: should we load the oauth config data from firestore based on the venue it's configured for or similar?
  const authClient = createOAuth2Client();

  // TODO: configure this in cloud config and/or firestore or similar
  // const authCodeReturnUri = "http://localhost:5006/oauth2/token";
  const authCodeReturnUri = `http://${req.headers["x-forwarded-host"]}/oauth2/token`; // TODO: refactor this to use a static URL from config as it's probably super insecure as is..

  // TODO: configure this in cloud config and/or firestore or similar
  const scope = "";

  // TODO: use a uuid4 for this state?
  // TODO: do we also want/need to store something about what venueId they were trying to access/etc for redirecting them back again?
  // TODO: it seems I4A's OAuth2 doesn't even send on the state param anyway, so no point using this here..
  // const state = crypto.randomBytes(20).toString("hex");
  // const state = "TODO-use-proper-state";

  // functions.logger.log(
  //   "Setting verification state in __session cookie:",
  //   state
  // );
  // res.cookie("__session", state);
  // res.cookie("__session", state, {
  //   maxAge: 60 * 60, // seconds
  //   // secure: true, // TODO: don't set this when running locally?
  //   httpOnly: true,
  //   sameSite: "strict",
  // });

  const redirectUri = authClient.authorizationCode.authorizeURL({
    redirect_uri: authCodeReturnUri,
    scope,
    // state,
  });

  functions.logger.log("Redirecting to:", redirectUri);
  res.redirect(redirectUri);
});

/**
 * Exchanges a given auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 */
exports.oauth2Token = functions.https.onRequest(async (req, res) => {
  const authClient = createOAuth2Client();

  // TODO: configure this in cloud config and/or firestore or similar
  const i4aGetUserInfoUrl =
    "https://www.humanbrainmapping.org/custom/api/Sparkle.cfm";
  const i4aApiKey = "TODO";

  // TODO: I4A's OAuth2 implementation doesn't seem to support the state parameter, so probaby no point using these cookies/etc
  // const cookieState = req.cookies["__session"];
  // const queryState = req.query.state;
  //
  // functions.logger.log("Received verification state:", cookieState);
  // functions.logger.log("Received state:", queryState);
  // if (!cookieState) {
  //   throw new Error(
  //     "__session cookie not set or expired. Maybe you took too long to authorize. Please try again."
  //   );
  // } else if (cookieState !== queryState) {
  //   throw new Error("State validation failed");
  // }

  const { code: authCode } = req.query;

  functions.logger.log("Received auth code:", authCode);
  const results = await authClient.authorizationCode.getToken({
    code: authCode,
    redirect_uri: "http://localhost:3000/in/foo", // TODO: what do we want to use here?
  });
  functions.logger.log("Auth code exchange result received:", results);

  // const { access_token: accessToken } = results;

  // TODO: We apparently are meant to use the accessToken with another API to query this I4A User ID from some API
  //   Though we seemingly haven't been given any details about that yet..
  const i4aUserId = 1234;

  // TODO: instead of manually creating these 2 checkes, we should map over an array of meeting IDs configured
  //   in cloud config and/or firestore or similar

  const checkMeeting1Body = {
    apiKey: i4aApiKey,
    ams_id: i4aUserId,
    meeting_id: 131, // TODO: configure this in cloud config and/or firestore or similar
  };

  const checkMeeting2Body = {
    apiKey: i4aApiKey,
    ams_id: i4aUserId,
    meeting_id: 136, // TODO: configure this in cloud config and/or firestore or similar
  };

  const checkMeeting1Promise = fetch(i4aGetUserInfoUrl, {
    method: "POST",
    body: JSON.stringify(checkMeeting1Body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());

  const checkMeeting2Promise = fetch(i4aGetUserInfoUrl, {
    method: "POST",
    body: JSON.stringify(checkMeeting2Body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());

  const [checkMeeting1Result, checkMeeting2Result] = await Promise.all([
    checkMeeting1Promise,
    checkMeeting2Promise,
  ]);

  functions.logger.log("Check Meeting 1 Result:", checkMeeting1Result);
  functions.logger.log("Check Meeting 2 Result:", checkMeeting2Result);

  // The details should be exactly the same from both of these API calls except for the is_registered value,
  // so we will just get the user's name/etc from the results of one of the calls.
  const {
    // title,
    // firstname,
    // lastname,
    // company,
    email,
    is_registered: isRegisteredMeeting1,
  } = checkMeeting1Result;

  const { is_registered: isRegisteredMeeting2 } = checkMeeting2Result;

  const isRegistered = isRegisteredMeeting1 || isRegisteredMeeting2;

  if (!isRegistered || !email) {
    // TODO: redirect to some kind of 'not allowed' page
    res.redirect("/TODO/not-registered");
    return;
  }

  const normalisedEmail = email.toLowerCase().trim();

  // Lookup the existing user by their email, or create them if they don't already exist
  const userRecord = await admin
    .auth()
    .getUserByEmail(normalisedEmail)
    .catch((error) => {
      // If user doesn't exist then create them
      if (error.code === "auth/user-not-found") {
        functions.logger.log(
          "Existing user not found, creating new user:",
          normalisedEmail
        );

        // We explicitly don't set a password here, which should prevent signing in that way (until the user resets their password to create one)
        // We also explicitly aren't creating the user's profile here, which will let them configure it in the normal way when they first sign in
        return admin.auth().createUser({
          email: normalisedEmail,
        });
      }
      throw error;
    });

  functions.logger.log("User:", {
    userId: userRecord.uid,
    email: userRecord.email,
  });

  const registeredMeetings = [];
  isRegisteredMeeting1 && registeredMeetings.push(checkMeeting1Body.meeting_id);
  isRegisteredMeeting2 && registeredMeetings.push(checkMeeting1Body.meeting_id);

  // Create a custom token for the frontend to use to sign into firebase auth as this user
  const customToken = await admin.auth().createCustomToken(userRecord.uid, {
    registeredMeetings,
  });

  // TODO: redirect back to the main application in a way that we can provide the custom auth token back to it
  res.redirect(`/in/TODO-venueId?customToken=${customToken}`);
});
