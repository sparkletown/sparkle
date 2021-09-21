import { Settings } from "./settings";

import { AuditoriumSection } from "types/auditorium";
import {
  JukeboxMessage,
  PrivateChatMessage,
  VenueChatMessage,
} from "types/chat";
import { ChatRequest } from "types/ChatRequest";
import { Reaction } from "types/reactions";
import { Role } from "types/Role";
import { ScreeningRoomVideo } from "types/screeningRoom";
import { Table } from "types/Table";
import { GridSeatedUser, User } from "types/User";
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
  // @debt this doesn't appear to be used by anything anymore
  // chatUsers?: Record<string, User>;
  currentEvent?: Record<string, VenueEvent>;
  currentVenue?: AnyVenue;
  sovereignVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, VenueEvent>;
  currentVenueNG?: AnyVenue;
  currentAuditoriumSections?: Partial<Record<string, AuditoriumSection>>;
  currentAuditoriumSectionSeatedUsers?: Partial<Record<string, GridSeatedUser>>;
  currentModalUser?: User;
  events?: Record<string, VenueEvent>;
  experience?: Experience;
  ownedVenues?: Record<string, AnyVenue>;
  playaVenues?: Record<string, AnyVenue>; // for the admin playa preview
  relatedVenues?: Record<string, AnyVenue>;
  reactions?: Record<string, Reaction>;
  settings?: Settings;
  screeningRoomVideos: Record<string, ScreeningRoomVideo>;
  animatemapFirebarrels: Partial<Record<string, Firebarrel>>;
  animatemapArtcars: Partial<Record<string, ArtCar>>;
  // @debt this doesn't appear to be used by anything anymore
  // userModalVisits?: Record<string, UserVisit>;
  userRoles?: Record<string, Role>;
  venueChatMessages?: Record<string, VenueChatMessage>;
  venueJukeboxMessages?: Record<string, JukeboxMessage>;
  venueEvents?: Record<string, VenueEvent>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  chatRequests?: WithId<ChatRequest>[];
  currentEvent?: WithId<VenueEvent>[];
  currentVenue?: WithId<AnyVenue>[];
  sovereignVenue?: WithId<AnyVenue>[];
  currentVenueEventsNG?: WithId<VenueEvent>[];
  currentVenueNG?: WithId<AnyVenue>[];
  currentAuditoriumSections?: WithId<AuditoriumSection>[];
  currentAuditoriumSectionSeatedUsers?: WithId<GridSeatedUser>[];
  currentModalUser?: WithId<User>[];
  events?: WithId<VenueEvent>[];
  experience: WithId<Experience>;
  ownedVenues?: WithId<AnyVenue>[];
  parentVenueEvents?: WithId<VenueEvent>[];
  playaVenues?: WithId<AnyVenue>[];
  reactions?: WithId<Reaction>[];
  screeningRoomVideos: WithId<ScreeningRoomVideo>[];
  siblingVenues?: WithId<AnyVenue>[];
  siblingVenueEvents?: WithId<VenueEvent>[];
  relatedVenues?: WithId<AnyVenue>[];
  animatemapFirebarrels: WithId<Firebarrel>[];
  animatemapArtcars: WithId<ArtCar>[];
  // @debt this doesn't appear to be used by anything anymore
  // statsOnlineUsers?: WithId<User>[];
  // statsOpenVenues?: WithId<AnyVenue>[];
  // subvenues?: WithId<AnyVenue>[];
  subvenueEvents?: WithId<VenueEvent>[];
  userModalVisits?: WithId<UserVisit>[];
  privateChatMessages?: WithId<PrivateChatMessage>[];
  posterVenues?: WithId<PosterPageVenue>[];
  venueChatMessages?: WithId<VenueChatMessage>[];
  venueJukeboxMessages?: WithId<JukeboxMessage>[];
  venueEvents?: WithId<VenueEvent>[];
}
