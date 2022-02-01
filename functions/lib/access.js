"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccess = exports.checkIsCodeValid = exports.checkIsEmailWhitelisted = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const uuidv4_1 = require("uuidv4");
const auth_1 = require("./auth");
const checkIsValidToken = async (venueId, uid, token) => {
    if (!venueId || !uid || !token)
        return false;
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
                [token]: Object.assign(Object.assign({}, grantedToken), { usedAt: Date.now() }),
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
        throw new https_1.HttpsError("not-found", `Venue ${venueId} does not exist`);
    }
    const accessDoc = await venue.ref.collection("access").doc(method).get();
    return accessDoc;
};
const isValidPassword = async (venueId, password) => {
    var _a, _b;
    if (!venueId || !password)
        return false;
    const access = await getAccessDoc(venueId, "Password");
    if (!access || !access.exists || !((_a = access.data()) === null || _a === void 0 ? void 0 : _a.password)) {
        return false;
    }
    return (0, auth_1.passwordsMatch)((_b = access.data()) === null || _b === void 0 ? void 0 : _b.password, password);
};
const isValidEmail = async (venueId, email) => {
    var _a, _b, _c;
    if (!venueId || !email)
        return false;
    const access = await getAccessDoc(venueId, "Emails");
    if (!access || !access.exists || !((_a = access.data()) === null || _a === void 0 ? void 0 : _a.emails)) {
        return false;
    }
    console.log((_b = access.data()) === null || _b === void 0 ? void 0 : _b.emails);
    return (_c = access.data()) === null || _c === void 0 ? void 0 : _c.emails.includes(email.trim().toLowerCase());
};
const isValidCode = async (venueId, code) => {
    var _a, _b;
    if (!venueId || !code)
        return false;
    const access = await getAccessDoc(venueId, "Codes");
    if (!access || !access.exists || !((_a = access.data()) === null || _a === void 0 ? void 0 : _a.codes)) {
        return false;
    }
    return (_b = access.data()) === null || _b === void 0 ? void 0 : _b.codes.includes(code.trim());
};
const createToken = async (venueId, uid, password, email, code) => {
    if (!venueId || !uid || (!password && !email && !code))
        return undefined;
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
            throw new https_1.HttpsError("not-found", `venue ${venueId} does not exist`);
        }
        const token = (0, uuidv4_1.uuid)();
        const tokenData = Object.assign(Object.assign(Object.assign({ usedAt: [Date.now()] }, (password && { password })), (email && { email })), (code && { code }));
        const newToken = { [token]: tokenData };
        if (granted.exists) {
            transaction.update(accessRef, newToken);
        }
        else {
            transaction.set(accessRef, newToken);
        }
        return token;
    })
        .catch(() => {
        return undefined;
    });
};
exports.checkIsEmailWhitelisted = functions.https.onCall(async (data) => isValidEmail(data.venueId, data.email));
exports.checkIsCodeValid = functions.https.onCall(async (data) => isValidCode(data.venueId, data.code));
exports.checkAccess = functions.https.onCall(async (data, context) => {
    var _a, _b;
    if (!data || !context)
        return { token: undefined };
    if (context &&
        context.auth &&
        context.auth.uid &&
        (await checkIsValidToken(data.venueId, context.auth.uid, data.token))) {
        return { token: data.token };
    }
    const [isPasswordValid, isEmailValid, isCodeValid] = await Promise.all([
        isValidPassword(data.venueId, data.password),
        isValidEmail(data.venueId, data.email),
        isValidCode(data.venueId, data.code),
    ]);
    if (isPasswordValid || isEmailValid || isCodeValid) {
        const token = await createToken(data.venueId, (_b = (_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : "", data.password, data.email, data.code);
        return { token: token || undefined };
    }
    return { token: undefined };
});
//# sourceMappingURL=access.js.map