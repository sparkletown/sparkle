import { LocalParticipant, RemoteParticipant } from "twilio-video";

export const useIsLocalParticipant = (
  participant: LocalParticipant | RemoteParticipant
): participant is LocalParticipant =>
  (participant as LocalParticipant).publishTrack !== undefined;
