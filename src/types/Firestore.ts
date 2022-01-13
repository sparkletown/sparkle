import firebase from "firebase/compat/app";
import {
  DocumentData,
  FirestoreDataConverter,
  Query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WriteBatch,
} from "firebase/firestore";

import { Settings } from "./settings";

import { World } from "api/world";

import { AuditoriumSeatedUser } from "types/auditorium";
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

// RE-EXPORT BEGIN

// type definitions to decrease declaration verbosity in other files
// also, during transition, to smooth out the compatability and the newer modular types

export type CompatCollectionReference<
  T
> = firebase.firestore.CollectionReference<T>;

export type CompatDocumentData = firebase.firestore.DocumentData;
export type InterimDocumentData = CompatDocumentData | DocumentData;

export type CompatFirestoreDataConverter<
  T
> = firebase.firestore.FirestoreDataConverter<T>;
export type InterimFirestoreDataConverter<T> =
  | CompatFirestoreDataConverter<T>
  | FirestoreDataConverter<T>;

export type CompatQueryDocumentSnapshot<
  T
> = firebase.firestore.QueryDocumentSnapshot<T>;
export type InterimQueryDocumentSnapshot<T> =
  | CompatQueryDocumentSnapshot<T>
  | QueryDocumentSnapshot<T>;

export type CompatQuery<T> = firebase.firestore.Query<T>;
export type InterimQuery<T> = CompatQuery<T> | Query<T>;

export type CompatCreated = firebase.firestore.SnapshotOptions;
export type InterimSnapshotOptions = CompatCreated | SnapshotOptions;

export type CompatWriteBatch = firebase.firestore.WriteBatch;
export type InterimWriteBatch = CompatWriteBatch | WriteBatch;

export type CompatDocumentReference<
  T
> = firebase.firestore.DocumentReference<T>;
export type CompatDocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type CompatTimestamp = firebase.firestore.Timestamp;

// RE-EXPORT END

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
  worldEdit?: World;
  currentWorld?: World;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  currentVenue?: WithId<AnyVenue>[];
  currentVenueEventsNG?: WithId<VenueEvent>[];
  currentVenueNG?: WithId<AnyVenue>[];
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
  worldEdit?: WithId<World>[];
}

export interface DistributedCounterValue {
  value: number;
}

export interface DistributedCounterShard {
  count: number;
}
