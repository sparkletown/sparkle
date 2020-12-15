const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { passwordsMatch } = require("./auth");
const { uuid } = require("uuidv4");

const checkIsValidToken = async (venueId, uid, token) => {
  if (!uid) return false;

  const venue = await admin.firestore().collection("venues").doc(venueId).get();
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
  const venue = await admin.firestore().collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  const accessDoc = await venue.ref.collection("access").doc(method).get();
  return accessDoc;
};

const isValidPassword = async (venueId, password) => {
  const access = await getAccessDoc(venueId, "password");
  if (!access.exists || !access.data().password) {
    return false;
  }
  return passwordsMatch(access.data().password, password);
};

const isValidEmail = async (venueId, email) => {
  const access = await getAccessDoc(venueId, "emails");
  if (!access.exists || !access.data().emails) {
    return false;
  }
  return access.data().emails.includes(email.trim().toLowerCase());
};

const isValidCode = async (venueId, code) => {
  const access = getAccessDoc(venueId, "code");
  if (!access.exists || !access.data().codes) {
    return false;
  }
  return access.data().codes.includes(code.trim());
};

const createToken = async (venueId, uid, password, email, code) => {
  const venue = await admin.firestore().collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  let granted = {};
  let grantedDoc = await venue.ref.collection("accessgranted").doc(uid).get();
  if (grantedDoc.exists) {
    granted = grantedDoc.data();
  }
  if (!granted.tokens) {
    granted.tokens = {};
  }
  // Record the first time the token was created
  const token = uuid();
  granted.tokens[token] = {
    usedAt: [new Date().getTime()],
    password: password ?? null,
    email: email ?? null,
    code: code ?? null,
  };
  await venue.ref.collection("accessgranted").doc(uid).set(granted);
  return { token };
};

exports.checkAccess = functions.https.onCall(async (data, context) => {
  console.log("checkAccess", data, context.auth);
  const isValidToken =
    context &&
    context.auth &&
    context.auth.uid &&
    (await checkIsValidToken(data.venueId, context.auth.uid, data.token));
  if (data.token && isValidToken) {
    console.log(`valid token, returning ${data.token}`);
    return { token: data.token };
  }

  const passwordValid =
    data.password && (await isValidPassword(data.venueId, data.password));
  const emailValid =
    data.email && (await isValidEmail(data.venueId, data.email));
  const codeValid = data.code && (await isValidCode(data.venueId, data.code));

  console.log(`valid: ${passwordValid},${emailValid},${codeValid}`);

  if (passwordValid || emailValid || codeValid) {
    const token = await createToken(
      data.venueId,
      context.auth.uid,
      data.password,
      data.email,
      data.code
    );
    console.log(`create token: ${token}`);
    return { token };
  }

  return false;
});
