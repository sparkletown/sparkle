/**
 * Types used by the VideoComms module. Not intended to be used outside
 * of that code.
 */
import Twilio from "twilio-video";

type TwilioTrackAndPublicationCallback = (
  track: Twilio.RemoteTrack,
  publication: Twilio.RemoteTrackPublication
) => void;

type TwilioPublicationCallback = (
  publication: Twilio.RemoteTrackPublication
) => void;

// @debt I imagine someone with more partience could figure out how to get
// rid of the type repitition here. It wasn't immediately obvious to me.
export type SubscribeToParticipantEvent = {
  (
    participant: Twilio.RemoteParticipant,
    eventName: "trackSubscribed",
    callback: TwilioTrackAndPublicationCallback
  ): void;
  (
    participant: Twilio.RemoteParticipant,
    eventName: "trackUnsubscribed",
    callback: TwilioTrackAndPublicationCallback
  ): void;
  (
    participant: Twilio.RemoteParticipant,
    eventName: "trackEnabled",
    callback: TwilioPublicationCallback
  ): void;
  (
    participant: Twilio.RemoteParticipant,
    eventName: "trackDisabled",
    callback: TwilioPublicationCallback
  ): void;
};

export type EventSubscription =
  | ["trackSubscribed", TwilioTrackAndPublicationCallback]
  | ["trackUnsubscribed", TwilioTrackAndPublicationCallback]
  | ["trackEnabled", TwilioPublicationCallback]
  | ["trackDisabled", TwilioPublicationCallback];
