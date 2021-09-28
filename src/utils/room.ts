import Bugsnag from "@bugsnag/js";
import Video from "twilio-video";

import { ParticipantWithUser } from "types/rooms";
import { VenueTemplate } from "types/venues";

import RoomIconArtPiece from "assets/icons/icon-room-artpiece.svg";
import RoomIconAuditorium from "assets/icons/icon-room-auditorium.svg";
import RoomIconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
import RoomIconConversation from "assets/icons/icon-room-conversation.svg";
import RoomIconExperience from "assets/icons/icon-room-experience.svg";
import RoomIconMap from "assets/icons/icon-room-map.svg";
import RoomIconMusicBar from "assets/icons/icon-room-musicbar.svg";

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

export interface VenueSpace {
  text: string;
  template?: VenueTemplate;
  icon: string;
}

export const venueSpacesList: VenueSpace[] = [
  {
    text: "Conversation Space",
    icon: RoomIconConversation,
    template: VenueTemplate.conversationspace,
  },
  {
    text: "Auditorium",
    icon: RoomIconAuditorium,
    template: VenueTemplate.audience,
  },
  {
    text: "Music Bar",
    icon: RoomIconMusicBar,
    template: VenueTemplate.jazzbar,
  },
  {
    text: "Burn Firebarrel",
    icon: RoomIconBurnBarrel,
    template: VenueTemplate.firebarrel,
  },
  {
    text: "Art Piece",
    icon: RoomIconArtPiece,
    template: VenueTemplate.artpiece,
  },
  {
    text: "Experience",
    icon: RoomIconExperience,
    template: VenueTemplate.zoomroom,
  },
  {
    text: "Map",
    icon: RoomIconMap,
    template: VenueTemplate.partymap,
  },
];
