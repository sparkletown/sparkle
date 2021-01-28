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
  if (!venueId || !method) return undefined;
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

  if (!access || !access.exists || !access.data().password) {
    return false;
  }

  return passwordsMatch(access.data().password, password);
};

const isValidEmail = async (venueId, email) => {
  if (!venueId || !email) return false;

  const access = await getAccessDoc(venueId, "emails");

  if (!access || !access.exists || !access.data().emails) {
    return false;
  }

  return access.data().emails.includes(email.trim().toLowerCase());
};

const isValidCode = async (venueId, code) => {
  if (!venueId || !code) return false;

  const access = getAccessDoc(venueId, "code");

  if (!access || !access.exists || !access.data().codes) {
    return false;
  }

  return access.data().codes.includes(code.trim());
};

const createToken = async (venueId, uid, password, email, code) => {
  if (!venueId || !uid || !password || !email || !code) return undefined;

  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const accessRef = admin.firestore().collection("accessgranted").doc(uid);

  if (!venueRef.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }

  return await admin
    .firestore()
    .runTransaction(async (transaction) => {
      const [venue, granted] = await Promise.all([
        transaction.get(venueRef),
        transaction.get(accessRef),
      ]);

      if (!venue.exists) {
        return undefined;
      }

      const token = uuid();

      const tokenData = {
        usedAt: [Date.now()],
        password: password,
        email: email,
        code: code,
      };

      const newToken = { [token]: tokenData };
      if (granted.exists) {
        transaction.update(accessRef, newToken);
      } else {
        transaction.set(accessRef, newToken);
      }

      return token;
    })
    .catch((e) => {
      console.log("Transaction failure:", e);
      return undefined;
    });
};

exports.checkAccess = functions.https.onCall(async (data, context) => {
  if (!data || !context) return { token: undefined };
  const isValidToken = await checkIsValidToken(
    data.venueId,
    context.auth.uid,
    data.token
  );
  if (context && context.auth && context.auth.uid && isValidToken) {
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
