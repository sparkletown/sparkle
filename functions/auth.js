const functions = require("firebase-functions");
// const admin = require("firebase-admin");

const oauth2 = require("simple-oauth2");

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
  // TODO: configure these creds in cloud config and/ore firestore or similar
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

  // TODO: use a uuid4 for this state?
  // TODO: do we also want/need to store something about what venueId they were trying to access/etc for redirecting them back again?
  // const state = crypto.randomBytes(20).toString("hex");
  const state = "TODO-use-proper-state";

  functions.logger.log(
    "Setting verification state in __session cookie:",
    state
  );
  res.cookie("__session", state, {
    maxAge: 60 * 60, // seconds
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  const redirectUri = authClient.authorizationCode.authorizeURL({
    redirect_uri: "http://localhost:3000/oauth2/token", // TODO: what do we want to use here?
    scope: "TODO", // TODO: what do we want to use here?
    state,
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

  functions.logger.log("Request:", JSON.stringify(req, null, 2));

  functions.logger.log("Received verification state:", req.cookies.state);
  functions.logger.log("Received state:", req.query.state);
  if (!req.cookies.state) {
    throw new Error(
      "State cookie not set or expired. Maybe you took too long to authorize. Please try again."
    );
  } else if (req.cookies.state !== req.query.state) {
    throw new Error("State validation failed");
  }

  functions.logger.log("Received auth code:", req.query.code);
  const results = await authClient.authorizationCode.getToken({
    code: req.query.code,
    redirect_uri: "http://localhost:3000/in/foo", // TODO: what do we want to use here?
  });
  functions.logger.log("Auth code exchange result received:", results);

  // TODO: do something with results
  //   extract userId/relevant details
  //   make an authenticated request to the 'get user details' API to retrieve this user's data
  //     we want to check this for both meeting ids, so may need to make 2 requests here as the API is.. lacking
  //   use the returned email address to lookup if an account already exists for this user
  //     if it doesn't exist: create one
  //     if it does exist: ?potentially update it to provide access to the appropriate areas/venues/etc as needed?
  //   create a custom firebase auth token to allow logging in as this user + return it to the client (possibly via redirect)?
  //     or should we create a session cookie maybe?
  //     do we want to set any custom claims on this token? https://firebase.google.com/docs/auth/admin/custom-claims
  //       and if so, how can we ensure those claims exist for the user the next time they login, potentially via a different method?
  //         it sounds like the claims are set on the user, and then propogate when the token is refreshed: https://firebase.google.com/docs/auth/admin/custom-claims#set_and_validate_custom_user_claims_via_the_admin_sdk
  //         they can be set on user creation/etc: https://firebase.google.com/docs/auth/admin/custom-claims#defining_roles_via_firebase_functions_on_user_creation

  // TODO
  // const userMaybe = await admin.auth().getUserByEmail("user@admin.example.com");

  // TODO
  // Ref: https://firebase.google.com/docs/auth/admin/create-custom-tokens#create_custom_tokens_using_the_firebase_admin_sdk
  // const foo = await admin.auth().createCustomToken(uid);
  // const foo = await admin.auth().createCustomToken(uid, additionalClaims);

  // TODO
  // // Create a Firebase account and get the Custom Auth Token.
  // const firebaseToken = await createFirebaseAccount(
  //   instagramUserID,
  //   userName,
  //   profilePic,
  //   accessToken
  // );

  // TODO: redirect back to the main application in a way that we can provide the custom auth token back to it
  res.redirect("TODO");
});

// TODO: extract the relevant patterns from this example code for 'create new user if required'/etc.
//   Note: we don't want to use all of the patterns/etc here, but it's a good starting reference
// /**
//  * Creates a Firebase account with the given user profile and returns a custom auth token allowing
//  * signing-in this account.
//  * Also saves the accessToken to the datastore at /instagramAccessToken/$uid
//  *
//  * @returns {Promise<string>} The Firebase custom auth token in a promise.
//  */
// async function createFirebaseAccount(instagramID, displayName, photoURL, accessToken) {
//   // The UID we'll assign to the user.
//   const uid = `instagram:${instagramID}`;
//
//   // Save the access token to the Firebase Realtime Database.
//   const databaseTask = admin.database().ref(`/instagramAccessToken/${uid}`).set(accessToken);
//
//   // Create or update the user account.
//   const userCreationTask = admin.auth().updateUser(uid, {
//     displayName: displayName,
//     photoURL: photoURL,
//   }).catch((error) => {
//     // If user does not exists we create it.
//     if (error.code === 'auth/user-not-found') {
//       return admin.auth().createUser({
//         uid: uid,
//         displayName: displayName,
//         photoURL: photoURL,
//       });
//     }
//     throw error;
//   });
//
//   // Wait for all async task to complete then generate and return a custom auth token.
//   await Promise.all([userCreationTask, databaseTask]);
//   // Create a Firebase custom auth token.
//   const token = await admin.auth().createCustomToken(uid);
//   functions.logger.log(
//     'Created Custom token for UID "',
//     uid,
//     '" Token:',
//     token
//   );
//   return token;
// }
