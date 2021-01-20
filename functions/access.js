const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { passwordsMatch } = require("./auth");
const { uuid } = require("uuidv4");

const checkIsValidToken = async (venueId, uid, token) => {
  console.log("asdasd");
  if (!uid) return false;

  console.log("asdasd");
  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const accessRef = admin.firestore().collection("accessgranted").doc(uid);

  try {
    console.log("asdasd");
    await admin.firestore().runTransaction(async (t) => {
      const venue = await t.get(venueRef);
      const granted = await t.get(accessRef);

      if (!venue.exists) {
        throw new HttpsError("not-found", `venue ${venueId} does not exist`);
      }
      if (!granted.exists || !granted.tokens) {
        return false;
      }

      console.log("v", venue);
      console.log("g", granted);
      if (Object.keys(granted.tokens).includes(token)) {
        // Record that the token was checked
        if (!granted.tokens[token].usedAt) {
          granted.tokens[token].usedAt = [];
        }
        granted.tokens[token].usedAt.push(Date.now());
        t.update(accessRef, granted);

        return true;
      } else {
        return false;
      }
    });
  } catch (e) {
    console.log("Transaction failure:", e);
    return false;
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

  const grantedDoc = await venue.ref.collection("accessgranted").doc(uid).get();
  const granted = grantedDoc.exists ? grantedDoc.data() : {};

  if (!granted.tokens) {
    granted.tokens = {};
  }
  // Record the first time the token was created
  const token = uuid();
  granted.tokens[token] = {
    usedAt: [Date.now()],
    password: password || null,
    email: email || null,
    code: code || null,
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

  const isPasswordValid =
    data.password && (await isValidPassword(data.venueId, data.password));
  const isEmailValid =
    data.email && (await isValidEmail(data.venueId, data.email));
  const isCodeValid = data.code && (await isValidCode(data.venueId, data.code));

  if (isPasswordValid || isEmailValid || isCodeValid) {
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
