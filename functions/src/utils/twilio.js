const functions = require("firebase-functions");
const twilio = require("twilio");

const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

const TWILIO_CONFIG = functions.config().twilio;

const generateTwilioToken = () => {
  return new AccessToken(
    TWILIO_CONFIG.account_sid,
    TWILIO_CONFIG.api_key,
    TWILIO_CONFIG.api_secret
  );
};

const twilioVideoToken = (identity, room) => {
  const videoGrant = new VideoGrant({ room });
  const token = generateTwilioToken();

  token.addGrant(videoGrant);
  token.identity = identity;

  return token;
};

exports.generateTwilioToken = generateTwilioToken;
exports.twilioVideoToken = twilioVideoToken;
