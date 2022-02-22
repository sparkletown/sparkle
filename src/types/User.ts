// @debt rename this file to be user rather than User

import { GridPosition } from "types/grid";
import { VenueTablePath } from "types/venues";

// Store all things related to video chat where they can't be tampered with by other users
export type VideoState = {
  inRoomOwnedBy?: string;
  removedParticipantUids?: string[];
};

// the structure is { [key: venueId] : eventId[] }
export type MyPersonalizedSchedule = Partial<Record<string, string[]>>;

export interface ProfileLink {
  title: string;
  url: string;
}

export interface Profile {
  partyName?: string;
  pictureUrl?: string;
  anonMode?: boolean;
  mirrorVideo?: boolean;
  status?: string;
  myPersonalizedSchedule?: MyPersonalizedSchedule;
  profileLinks?: ProfileLink[];

  // forward compatible type: true/false now, can have other constants for finer grained access in the future
  // e.g. beta tester, demo or POC, maybe able to test A or B functionality not both etc.
  tester?: null | boolean | string | string[];

  // @debt typing - user also has a dynamic set of attributes for the question answers
  //   currently not possible to type them properly
  // [question: string]: string;

  // @debt these types are legacy and should be cleaned up across the codebase
  room?: string; // @debt: is this valid/used anymore? Use in JazzBarTableComponent, ProfileModal
  video?: VideoState; // @debt: is this valid/used anymore? Used in FireBarrel, Playa (Avatar, AvatarLayer, AvatarPartygoers, MyAvatar, Playa, VideoChatLayer
  kidsMode?: boolean; // @debt: is this valid/used anymore? Used in UserInformationContent, Playa
}

export interface User extends Profile {
  lastVenueIdSeenIn?: never;
  lastSeenAt?: never;
  enteredVenueIds?: never;
  enteredWorldIds?: never;
}

export type DisplayUser = Pick<User, "partyName" | "pictureUrl" | "anonMode">;

export type GridSeatedUser = DisplayUser & {
  position: Partial<GridPosition>;
};

export type TableSeatedUser = DisplayUser & {
  path: VenueTablePath;
};

export interface UserStatus {
  status: string;
  color: string;
}

export interface UserLocation {
  lastVenueIdSeenIn: string | null;
  lastSeenAt: number;
  enteredVenueIds?: string[];
  enteredWorldIds?: string[];
}

export type UserWithLocation = Profile & UserLocation;
