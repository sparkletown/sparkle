const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { passwordsMatch } = require("./auth");
const { uuid } = require("uuidv4");

const checkIsValidToken = async (venueId, uid, token) => {
  if (!venueId || !uid || !token) return false;

  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const accessRef = admin.firestore().collection("accessgranted").doc(uid);

  return await admin
    .firestore()
    .runTransaction(async (transaction) => {
      const [venue, granted] = await Promise.all([
        transaction.get(venueRef),
        transaction.get(accessRef),
      ]);

      if (!venue.exists || !granted.exists || !granted.tokens) {
        return false;
      }

      if (Object.keys(granted.tokens).includes(token)) {
        // Record that the token was checked
        const isTokenChecked = granted.tokens[token].usedAt;

        const newToken = {
          ...token,
          usedAt: Date.now(),
        };
        // granted.tokens[token].usedAt.push(Date.now());
        transaction.update(
          accessRef,
          admin.firestore.FieldValue.arrayUnion(
            isTokenChecked ? token : newToken
          )
        );

        return true;
      }

      return false;
    })
    .catch((e) => {
      console.log("Transaction failure:", e);
      return false;
    });
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
  if (!venueId || !password) return false;

  const access = await getAccessDoc(venueId, "password");

  if (!access.exists || !access.data().password) {
    return false;
  }

  return passwordsMatch(access.data().password, password);
};

const isValidEmail = async (venueId, email) => {
  if (!venueId || !email) return false;

  const access = await getAccessDoc(venueId, "emails");

  if (!access.exists || !access.data().emails) {
    return false;
  }

  return access.data().emails.includes(email.trim().toLowerCase());
};

const isValidCode = async (venueId, code) => {
  if (!venueId || !code) return false;

  const access = getAccessDoc(venueId, "code");

  if (!access.exists || !access.data().codes) {
    return false;
  }

  return access.data().codes.includes(code.trim());
};

const createToken = async (venueId, uid, password, email, code) => {
  if (!venueId || !uid || !password || !email || !code) return undefined;

  const venue = await admin.firestore().collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }

  const token = uuid();
  const grantedDoc = await venue.ref.collection("accessgranted").doc(uid).get();

  const tokenData = {
    usedAt: [Date.now()],
    password: password || null,
    email: email || null,
    code: code || null,
  };

  if (grantedDoc.exists) {
    await grantedDoc.update({ [`tokens.${token}`]: tokenData });
  } else {
    const granted = { tokens: { [token]: tokenData } };
    await grantedDoc.set(granted);
  }
  return token;
};

exports.checkAccess = functions.https.onCall(async (data, context) => {
  console.log("checkAccess", data, context.auth);
  const isValidToken =
    context &&
    context.auth &&
    context.auth.uid &&
    (await checkIsValidToken(data.venueId, context.auth.uid, data.token));
  if (isValidToken) {
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
