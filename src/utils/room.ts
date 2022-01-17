import Bugsnag from "@bugsnag/js";
import Video from "twilio-video";

import { SpaceSlug } from "types/id";
import { ParticipantWithUser, Room } from "types/rooms";

export interface GetExternalRoomSlugProps {
  venueName: string;
  roomTitle?: string;
}

export const getExternalRoomSlug = ({
  venueName,
  roomTitle,
}: GetExternalRoomSlugProps) => `${venueName}/${roomTitle}`;

export const logIfCannotFindExistingParticipant = (
  existingParticipant: ParticipantWithUser[],
  participant: Video.Participant
) => {
  if (
    !existingParticipant.find(
      (p) => p.participant.identity === participant.identity
    )
  ) {
    // @debt Remove when root issue found and fixed
    console.error("Could not find disconnnected participant:", participant);
    Bugsnag.notify(
      new Error("Could not find disconnnected participant"),
      (event) => {
        const { identity, sid } = participant;
        event.addMetadata("Room::participantDisconnected", {
          identity,
          sid,
        });
      }
    );
  }
};

export const parsePortalSlug = (portal: Room) => {
  return portal?.url?.split("/").pop() as SpaceSlug;
};
