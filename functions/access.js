const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { passwordsMatch } = require(".");
const { checkAuth } = require("./auth");
const { uuidv4 } = require("uuidv4");

const checkIsValidToken = async (venueId, uid, token) => {
  const venue = await admin.collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  const granted = await venue.ref.collection("accessgranted").doc(uid).get();
  if (!granted.exists || !granted.tokens) {
    return false;
  }

  if (Object.keys(granted.tokens).includes(token)) {
    // Record that the token was checked
    if (!granted.tokens[token].usedAt) {
      granted.tokens[token].usedAt = [];
    }
    granted.tokens[token].usedAt.push(new Date().getTime());
    await venue.ref.collection("accessgranted").doc(uid).set(granted);
    return true;
  }

  return false;
};

const getAccessDoc = async (venueId, method) => {
  const venue = await admin.collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  return await venue.ref.collection("access").doc(method).get();
};

const isValidPassword = async (venueId, password) => {
  const access = getAccessDoc(venueId, "password");
  if (!access.exists || !access.password) {
    return false;
  }
  return passwordsMatch(access.password, password);
};

const isValidEmail = async (venueId, email) => {
  const access = getAccessDoc(venueId, "email");
  if (!access.exists || !access.emails) {
    return false;
  }
  return access.emails.includes(email.trim().toLowerCase());
};

const isValidCode = async (venueId, code) => {
  const access = getAccessDoc(venueId, "code");
  if (!access.exists || !access.codes) {
    return false;
  }
  return access.codes.includes(code.trim());
};

const createToken = async (venueId, uid, password, email, code) => {
  const venue = await admin.collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  let granted = await venue.ref.collection("accessgranted").doc(uid).get();
  if (!granted.exists) {
    granted = {};
  }
  if (!granted.tokens) {
    granted.tokens = {};
  }
  // Record the first time the token was created
  const token = uuidv4();
  granted.tokens[token] = {
    usedAt: [new Date().getTime()],
    password,
    email,
    code,
  };
  await venue.ref.collection("accessgranted").doc(uid).set(granted);
  return { token };
};

exports.checkAccess = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const isValidToken = await checkIsValidToken(
    data.venueId,
    context.auth.uid,
    data.token
  );
  if (data.token && isValidToken) {
    return { token: data.token };
  }

  const passwordValid =
    data.password && (await isValidPassword(data.venueId, data.password));
  const emailValid =
    data.email && (await isValidEmail(data.venueId, data.email));
  const codeValid = data.code && (await isValidCode(data.venueId, data.code));

  if (passwordValid || emailValid || codeValid) {
    const token = await createToken(
      data.venueId,
      context.auth.uid,
      data.password,
      data.email,
      data.code
    );
    return { token };
  }

  throw new HttpsError(
    "permission-denied",
    "You appear to have no access to this venue."
  );
});
