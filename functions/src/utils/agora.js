const functions = require("firebase-functions");

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

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

const getExpirationTime = () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  return currentTimestamp + expirationTimeInSeconds;
};

const generateAgoraTokenForAccount = ({ channelName, account, role }) => {
  assertValidAgoraConfig();

  // @debt we should enforce a stricter security requirement on channelName. Maybe use UUIDs?
  if (typeof channelName !== "string")
    throw new Error("channelName must be a string");
  if (channelName.length <= 0) throw new Error("channelName must not be empty");

  if (typeof account !== "string") throw new Error("account must be a string");
  if (account.length <= 0) throw new Error("account must not be empty");

  if (![RtcRole.PUBLISHER, RtcRole.SUBSCRIBER].includes(role))
    throw new Error("role must be a valid value from the RtcRole enum");

  return RtcTokenBuilder.buildTokenWithAccount(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    account,
    role,
    getExpirationTime()
  );
};

exports.assertValidAgoraConfig = assertValidAgoraConfig;
exports.getExpirationTime = getExpirationTime;
exports.generateAgoraTokenForAccount = generateAgoraTokenForAccount;
exports.RtcRole = RtcRole;
