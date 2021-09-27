import { Settings } from "./settings";

import { AuditoriumSeatedUser, AuditoriumSection } from "types/auditorium";
import {
  JukeboxMessage,
  PrivateChatMessage,
  VenueChatMessage,
} from "types/chat";
import { Reaction } from "types/reactions";
import { Role } from "types/Role";
import { ScreeningRoomVideo } from "types/screeningRoom";
import { Table } from "types/Table";
import { TableSeatedUser, User } from "types/User";
import { AnyVenue, PosterPageVenue, VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { AdminRole } from "hooks/roles";

import { ArtCar, Firebarrel } from "./animateMap";

export interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Record<string, Table>>;
}
export interface UserVisit {
  timeSpent: number;
}

export type ValidFirestoreRootCollections =
  | "customers"
  | "experiences"
  | "roles"
  | "userprivate"
  | "users"
  | "venues";

export type ValidFirestoreKeys = keyof FirestoreData | keyof FirestoreOrdered;

export type ValidStoreAsKeys = Exclude<
  ValidFirestoreKeys,
  ValidFirestoreRootCollections
>;

export interface Firestore {
  data: FirestoreData;
  ordered: FirestoreOrdered;
  status: FirestoreStatus;
}

export interface FirestoreStatus {
  requesting: Record<ValidFirestoreKeys, boolean>;
  requested: Record<ValidFirestoreKeys, boolean>;
  timestamps: Record<ValidFirestoreKeys, number>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreData {
  adminRole?: AdminRole;
  allowAllRoles?: Record<string, Role>;
  currentVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, VenueEvent>;
  currentVenueNG?: AnyVenue;
  currentAuditoriumSections?: Partial<Record<string, AuditoriumSection>>;
  currentAuditoriumSeatedSectionUsers?: Partial<
    Record<string, AuditoriumSeatedUser>
  >;
  currentSeatedTableUsers?: Record<string, TableSeatedUser>;
  currentModalUser?: User;
  currentEvent?: Record<string, VenueEvent>;
  experience?: Experience;
  ownedVenues?: Record<string, AnyVenue>;
  reactions?: Record<string, Reaction>;
  settings?: Settings;
  screeningRoomVideos: Record<string, ScreeningRoomVideo>;
  animatemapFirebarrels: Partial<Record<string, Firebarrel>>;
  animatemapArtcars: Partial<Record<string, ArtCar>>;
  userRoles?: Record<string, Role>;
  venueChatMessages?: Record<string, VenueChatMessage>;
  venueJukeboxMessages?: Record<string, JukeboxMessage>;
  venueEvents?: Record<string, VenueEvent>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  currentVenue?: WithId<AnyVenue>[];
  currentVenueEventsNG?: WithId<VenueEvent>[];
  currentVenueNG?: WithId<AnyVenue>[];
  currentAuditoriumSections?: WithId<AuditoriumSection>[];
  currentAuditoriumSeatedSectionUsers?: WithId<AuditoriumSeatedUser>[];
  currentSeatedTableUsers?: WithId<TableSeatedUser>[];
  currentModalUser?: WithId<User>[];
  currentEvent?: WithId<VenueEvent>[];
  events?: WithId<VenueEvent>[];
  experience: WithId<Experience>;
  ownedVenues?: WithId<AnyVenue>[];
  parentVenueEvents?: WithId<VenueEvent>[];
  reactions?: WithId<Reaction>[];
  screeningRoomVideos: WithId<ScreeningRoomVideo>[];
  siblingVenues?: WithId<AnyVenue>[];
  siblingVenueEvents?: WithId<VenueEvent>[];
  animatemapFirebarrels: WithId<Firebarrel>[];
  animatemapArtcars: WithId<ArtCar>[];
  privateChatMessages?: WithId<PrivateChatMessage>[];
  posterVenues?: WithId<PosterPageVenue>[];
  venueChatMessages?: WithId<VenueChatMessage>[];
  venueJukeboxMessages?: WithId<JukeboxMessage>[];
  venueEvents?: WithId<VenueEvent>[];
}
