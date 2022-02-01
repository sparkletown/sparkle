"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcRole = exports.generateAgoraTokenForAccount = exports.getExpirationTime = exports.assertValidAgoraConfig = void 0;
const agora_access_token_1 = require("agora-access-token");
Object.defineProperty(exports, "RtcRole", { enumerable: true, get: function () { return agora_access_token_1.RtcRole; } });
const functions = require("firebase-functions");
const AGORA_CONFIG = functions.config().agora || {};
const AGORA_APP_ID = AGORA_CONFIG.app_id;
const AGORA_APP_CERTIFICATE = AGORA_CONFIG.app_certificate;
// @debt should we move this into AGORA_CONFIG, or maybe venue config in firestore or similar?
const expirationTimeInSeconds = 3600;
const assertValidAgoraConfig = () => {
    if (typeof AGORA_APP_ID !== "string")
        throw new Error("AGORA_APP_ID must be a string");
    if (AGORA_APP_ID.length <= 0)
        throw new Error("AGORA_APP_ID must not be empty");
    if (typeof AGORA_APP_CERTIFICATE !== "string")
        throw new Error("AGORA_APP_CERTIFICATE must be a string");
    if (AGORA_APP_CERTIFICATE.length <= 0)
        throw new Error("AGORA_APP_CERTIFICATE must not be empty");
};
exports.assertValidAgoraConfig = assertValidAgoraConfig;
const getExpirationTime = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return currentTimestamp + expirationTimeInSeconds;
};
exports.getExpirationTime = getExpirationTime;
const generateAgoraTokenForAccount = ({ channelName, account, role, }) => {
    (0, exports.assertValidAgoraConfig)();
    // @debt we should enforce a stricter security requirement on channelName. Maybe use UUIDs?
    if (typeof channelName !== "string")
        throw new Error("channelName must be a string");
    if (channelName.length <= 0)
        throw new Error("channelName must not be empty");
    if (typeof account !== "string")
        throw new Error("account must be a string");
    if (account.length <= 0)
        throw new Error("account must not be empty");
    if (![agora_access_token_1.RtcRole.PUBLISHER, agora_access_token_1.RtcRole.SUBSCRIBER].includes(role))
        throw new Error("role must be a valid value from the RtcRole enum");
    return agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(AGORA_APP_ID, AGORA_APP_CERTIFICATE, channelName, account, role, (0, exports.getExpirationTime)());
};
exports.generateAgoraTokenForAccount = generateAgoraTokenForAccount;
//# sourceMappingURL=agora.js.map