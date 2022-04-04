// @debt rename this file to be user rather than User

import { SeatPosition } from "types/grid";
import { VenueTablePath } from "types/venues";

// the structure is { [key: venueId] : eventId[] }
export type MyPersonalizedSchedule = Partial<Record<string, string[]>>;

export interface ProfileLink {
  title: string;
  url: string;
}

export interface Profile {
  partyName?: string;
  pictureUrl?: string;
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
}

export interface User extends Profile {
  lastVenueIdSeenIn?: never;
  lastSeenAt?: never;
  enteredVenueIds?: never;
  enteredWorldIds?: never;
}

export type DisplayUser = Pick<User, "partyName" | "pictureUrl">;

export type GridSeatedUser = DisplayUser & {
  position: Partial<SeatPosition>;
};

export type TableSeatedUser = DisplayUser & {
  path: VenueTablePath;
};

export type SeatedUser<T> = DisplayUser & {
  worldId: string;
  spaceId: string;
  seatData: T;
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
