"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoAdminOnRegister = exports.connectI4AOAuthHandler = exports.connectI4AOAuth = exports.getCustomAuthConfig = exports.passwordsMatch = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const auth_1 = require("./api/auth");
const roles_1 = require("./api/roles");
const assert_1 = require("./utils/assert");
const auth_2 = require("./utils/auth");
const fetch_1 = require("./utils/fetch");
// @debt refactor lowercaseFirstChar into utils/* (or maybe remove it entirely...?)
// Case-insensitive first character for iDevices
const lowercaseFirstChar = (password) => password.charAt(0).toLowerCase() + password.substring(1);
// @debt refactor passwordsMatch into utils/*
const passwordsMatch = (submittedPassword, actualPassword) => submittedPassword.trim() === actualPassword.trim() ||
    lowercaseFirstChar(submittedPassword.trim()) ===
        lowercaseFirstChar(actualPassword.trim());
exports.passwordsMatch = passwordsMatch;
exports.getCustomAuthConfig = functions.https.onCall(async (data) => {
    const { venueId } = data;
    (0, assert_1.assertValidVenueId)(venueId, "venueId");
    const { customAuthName, customAuthConnectPath } = await (0, auth_1.fetchAuthConfig)(venueId).catch(() => ({}));
    return { customAuthName, customAuthConnectPath };
});
/**
 * Redirect the user to the authentication consent screen.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#authorizeurlauthorizeoptions--string
 */
exports.connectI4AOAuth = functions.https.onRequest(async (req, res) => {
    const { venueId, returnOrigin } = req.query;
    if (typeof venueId !== "string") {
        throw new https_1.HttpsError("invalid-argument", "venueId is not a string");
    }
    if (typeof returnOrigin !== "string") {
        throw new https_1.HttpsError("invalid-argument", "returnOrigin is not a string");
    }
    (0, assert_1.assertValidVenueId)(venueId, "venueId");
    (0, assert_1.assertValidUrl)(returnOrigin, "returnOrigin");
    const authConfig = await (0, auth_1.fetchAuthConfig)(venueId);
    const { validReturnOrigins, scope, tokenHost, revokePath: revokePathWithoutRedirect, } = authConfig;
    if (!validReturnOrigins.includes(returnOrigin)) {
        throw new https_1.HttpsError("invalid-argument", "returnOrigin is not an allowed origin");
    }
    // Construct the platform URL that the revoke endpoint will redirect back to
    const revokeReturnUrl = new URL(`/v/${venueId}`, returnOrigin).toString();
    const revokePathWithRedirectUrl = new URL(revokePathWithoutRedirect, tokenHost);
    revokePathWithRedirectUrl.searchParams.set("redirect_uri", revokeReturnUrl);
    const revokePath = `${revokePathWithRedirectUrl.pathname}${revokePathWithRedirectUrl.search}`;
    const authClient = (0, auth_2.createOAuth2Client)(Object.assign(Object.assign({}, authConfig), { revokePath }));
    // Construct the platform URL that the auth code will be returned to
    const authCodeReturnUrl = new URL("/auth/connect/i4a/handler", returnOrigin);
    authCodeReturnUrl.searchParams.set("venueId", venueId);
    authCodeReturnUrl.searchParams.set("returnOrigin", returnOrigin);
    const authorizeUrl = authClient.authorizationCode.authorizeURL({
        redirect_uri: authCodeReturnUrl.toString(),
        scope,
    });
    functions.logger.log("Redirecting to authorize URL:", authorizeUrl);
    res.redirect(authorizeUrl);
});
/**
 * Exchanges a given auth code passed in the 'code' URL query parameter for an access token,
 * looks up the associated I4A user's details, creates/fetches a firebase account, and then
 * finally returns a custom Firebase auth token that the frontend can use to login as this user.
 */
exports.connectI4AOAuthHandler = functions.https.onRequest(async (req, res) => {
    const { venueId, returnOrigin, code: authCode } = req.query;
    if (typeof venueId !== "string") {
        throw new https_1.HttpsError("invalid-argument", "venueId is not a string");
    }
    if (typeof returnOrigin !== "string") {
        throw new https_1.HttpsError("invalid-argument", "returnOrigin is not a string");
    }
    (0, assert_1.assertValidVenueId)(venueId, "venueId");
    (0, assert_1.assertValidUrl)(returnOrigin, "returnOrigin");
    if (!authCode) {
        throw new https_1.HttpsError("invalid-argument", "code is required");
    }
    const authConfig = await (0, auth_1.fetchAuthConfig)(venueId);
    const { validReturnOrigins, i4aApiKey, i4aOAuthUserInfoUrl, i4aGetUserMeetingInfoUrl, i4aMeetingIdsToCheck, i4aEventIdsToCheck, } = authConfig;
    if (!validReturnOrigins.includes(returnOrigin)) {
        throw new https_1.HttpsError("invalid-argument", "returnOrigin is not an allowed origin");
    }
    const authClient = (0, auth_2.createOAuth2Client)(authConfig);
    functions.logger.log("Received auth code:", authCode);
    const results = await authClient.authorizationCode.getToken({
        code: authCode,
        redirect_uri: "http://localhost:3000/in/foo", // TODO: what do we want to use here?
    });
    functions.logger.log("Auth code exchange result received:", results);
    const { access_token: accessToken } = results;
    // Retrieve the user's I4A User ID
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { id: i4aUserId } = await (0, fetch_1.getJson)(i4aOAuthUserInfoUrl, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Authorization: `Bearer ${accessToken}`,
    });
    functions.logger.log("I4A User ID:", i4aUserId);
    if (!i4aUserId) {
        throw new https_1.HttpsError("internal", "failed to retrieve i4aUserId");
    }
    const checkedMeetingResult = await (0, fetch_1.postJson)(i4aGetUserMeetingInfoUrl, {
        apiKey: i4aApiKey,
        ams_id: i4aUserId,
    });
    functions.logger.log("Checked Meeting Result:", checkedMeetingResult);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    email: emailRaw, 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    meeting_ids: meetingIds = [], 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event_ids: eventIds = [], } = checkedMeetingResult;
    const registeredMeetings = meetingIds.filter((meetingId) => i4aMeetingIdsToCheck.includes(meetingId));
    const registeredEvents = eventIds.filter((eventId) => i4aEventIdsToCheck.includes(eventId));
    const isRegistered = registeredMeetings.length > 0 && registeredEvents.length > 0;
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
            functions.logger.log("Existing user not found, creating new user:", email);
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
    const customTokenReturnUrl = new URL(`/login/${venueId}/${customToken}`, returnOrigin);
    functions.logger.log("Redirecting back to platform with custom token:", customTokenReturnUrl);
    res.redirect(customTokenReturnUrl.toString());
});
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
exports.autoAdminOnRegister = functions.auth
    .user()
    .onCreate(async (user) => {
    const flag = functions.config().flag || {};
    if (flag.autoadmin) {
        functions.logger.log("flag.autoadmin is", flag.autoadmin, "adding user.uid", user.uid, "with email", user.email, "to the admin role");
        await (0, roles_1.addAdmin)(user.uid);
    }
});
//# sourceMappingURL=auth.js.map