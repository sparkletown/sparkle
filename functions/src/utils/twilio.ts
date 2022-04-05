import * as functions from "firebase-functions";
import * as twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

const TWILIO_CONFIG = functions.config().twilio;

export const generateTwilioToken = () => {
  return new AccessToken(
    TWILIO_CONFIG.account_sid,
    TWILIO_CONFIG.api_key,
    TWILIO_CONFIG.api_secret
  );
};

export const twilioVideoToken = (identity: string, room: string) => {
  const videoGrant = new VideoGrant({ room });
  const token = generateTwilioToken();

  token.addGrant(videoGrant);
  token.identity = identity;

  return token;
};

export const twilioRoomParticipants = async (room: string) => {
  const client = new twilio.Twilio(
    TWILIO_CONFIG.api_key,
    TWILIO_CONFIG.api_secret,
    { accountSid: TWILIO_CONFIG.account_sid }
  );

  const participants = await client.video
    .rooms(room)
    .participants.list({ status: "connected" });

  return participants;
};
