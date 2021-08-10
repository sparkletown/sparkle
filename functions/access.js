const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { uuid } = require("uuidv4");
const { checkUserIsOwner } = require("./src/utils/venue");

const { passwordsMatch } = require("./auth");

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

      if (!venue.exists || !granted.exists) {
        return false;
      }

      // @debt Add additional password check to see if it has changed.
      const grantedToken = granted.get(token);
      if (grantedToken) {
        // @debt Add timelimit, concept of token expiration.
        const newToken = {
          [token]: {
            ...grantedToken,
            usedAt: Date.now(),
          },
        };

        // @debt Do this only when isTokenChecked is expired or doesn't exist
        transaction.update(accessRef, newToken);

        return true;
      }

      return false;
    })
    .catch(() => {
      return false;
    });
};

const getAccessDoc = async (venueId, method) => {
  if (!venueId || !method) {
    return undefined;
  }
  const venue = await admin.firestore().collection("venues").doc(venueId).get();
  if (!venue.exists) {
    throw new HttpsError("not-found", `venue ${venueId} does not exist`);
  }
  const accessDoc = await venue.ref.collection("access").doc(method).get();
  return accessDoc;
};

const isValidPassword = async (venueId, password) => {
  if (!venueId || !password) return false;

  const access = await getAccessDoc(venueId, "Password");

  if (!access || !access.exists || !access.data().password) {
    return false;
  }

  return passwordsMatch(access.data().password, password);
};

const isValidEmail = async (venueId, email) => {
  if (!venueId || !email) return false;

  const access = await getAccessDoc(venueId, "Emails");

  if (!access || !access.exists || !access.data().emails) {
    return false;
  }

  console.log(access.data().emails);

  return access.data().emails.includes(email.trim().toLowerCase());
};

const isValidCode = async (venueId, code) => {
  if (!venueId || !code) return false;

  const access = getAccessDoc(venueId, "Code");

  if (!access || !access.exists || !access.data().codes) {
    return false;
  }

  return access.data().codes.includes(code.trim());
};

const createToken = async (venueId, uid, password, email, code) => {
  if (!venueId || !uid || (!password && !email && !code)) return undefined;

  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const accessRef = admin.firestore().collection("accessgranted").doc(uid);

  return await admin
    .firestore()
    .runTransaction(async (transaction) => {
      const [venue, granted] = await Promise.all([
        transaction.get(venueRef),
        transaction.get(accessRef),
      ]);

      if (!venue.exists) {
        throw new HttpsError("not-found", `venue ${venueId} does not exist`);
      }

      const token = uuid();

      const tokenData = {
        usedAt: [Date.now()],
        ...(password && { password }),
        ...(email && { email }),
        ...(code && { code }),
      };

      const newToken = { [token]: tokenData };
      if (granted.exists) {
        transaction.update(accessRef, newToken);
      } else {
        transaction.set(accessRef, newToken);
      }

      return token;
    })
    .catch(() => {
      return undefined;
    });
};

exports.checkIsEmailWhitelisted = functions.https.onCall(async (data) =>
  isValidEmail(data.venueId, data.email)
);

exports.addEmailsToWhitelist = functions.https.onCall(async (data, context) => {
  const { venueId, emails } = data;

  if (!venueId) return;

  await checkUserIsOwner(venueId, context.auth.token.user_id);

  const access = await getAccessDoc(venueId, "Emails");
  const oldEmails =
    access && access.exists && access.data().emails ? access.data().emails : [];
  const emailsToSet = [
    ...oldEmails,
    ...emails.filter((email) => !oldEmails.includes(email)),
  ];
  await access.ref.set({ emails: emailsToSet });
});

exports.getWhitelistedEmails = functions.https.onCall(async (data, context) => {
  const { venueId } = data;

  if (!venueId) return [];

  await checkUserIsOwner(venueId, context.auth.token.user_id);

  const access = await getAccessDoc(venueId, "Emails");

  if (!(access && access.exists && access.data().emails)) {
    return [];
  }

  return access.data().emails;
});

exports.removeEmailFromWhitelist = functions.https.onCall(
  async (data, context) => {
    const { venueId, email } = data;

    if (!venueId) return;

    await checkUserIsOwner(venueId, context.auth.token.user_id);

    const access = await getAccessDoc(venueId, "Emails");

    if (!(access && access.exists && access.data().emails)) {
      return;
    }

    const emailsToSet = access
      .data()
      .emails.filter((oldEmail) => oldEmail !== email);
    await access.ref.set({
      emails: emailsToSet,
    });
  }
);

exports.checkAccess = functions.https.onCall(async (data, context) => {
  if (!data || !context) return { token: undefined };

  if (
    context &&
    context.auth &&
    context.auth.uid &&
    (await checkIsValidToken(data.venueId, context.auth.uid, data.token))
  ) {
    return { token: data.token };
  }

  const [isPasswordValid, isEmailValid, isCodeValid] = await Promise.all([
    isValidPassword(data.venueId, data.password),
    isValidEmail(data.venueId, data.email),
    isValidCode(data.venueId, data.code),
  ]);

  if (isPasswordValid || isEmailValid || isCodeValid) {
    const token = await createToken(
      data.venueId,
      context.auth.uid,
      data.password,
      data.email,
      data.code
    );
    return { token: token || undefined };
  }

  return { token: undefined };
});
