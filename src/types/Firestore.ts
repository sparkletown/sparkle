import firebase from "firebase/compat/app";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { Settings } from "./settings";

import { World } from "api/world";

import {
  JukeboxMessage,
  PrivateChatMessage,
  VenueChatMessage,
} from "types/chat";
import { Reaction } from "types/reactions";
import { ScreeningRoomVideo } from "types/screeningRoom";
import { Table } from "types/Table";
import { User } from "types/User";
import { AnyVenue, PosterPageVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";

import { AdminRole } from "hooks/user/useAdminRole";

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
export type CompatCreated = firebase.firestore.SnapshotOptions;
export type InterimSnapshotOptions = CompatCreated | SnapshotOptions;

// RE-EXPORT END

export interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Record<string, Table>>;
}

export interface UserVisit {
  timeSpent: number;
}

export type ValidFirestoreKeys = keyof FirestoreData | keyof FirestoreOrdered;

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
  currentVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, WorldEvent>;
  currentVenueNG?: AnyVenue;
  currentModalUser?: User;
  currentEvent?: Record<string, WorldEvent>;
  experience?: Experience;
  ownedVenues?: Record<string, AnyVenue>;
  reactions?: Record<string, Reaction>;
  settings?: Settings;
  screeningRoomVideos: Record<string, ScreeningRoomVideo>;
  animatemapFirebarrels: Partial<Record<string, Firebarrel>>;
  animatemapArtcars: Partial<Record<string, ArtCar>>;
  venueChatMessages?: Record<string, VenueChatMessage>;
  venueJukeboxMessages?: Record<string, JukeboxMessage>;
  venueEvents?: Record<string, WorldEvent>;
  worldEdit?: World;
  currentWorld?: World;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  currentVenue?: WithId<AnyVenue>[];
  currentVenueEventsNG?: WorldEvent[];
  currentVenueNG?: WithId<AnyVenue>[];
  currentModalUser?: WithId<User>[];
  currentEvent?: WorldEvent[];
  events?: WorldEvent[];
  experience: WithId<Experience>;
  ownedVenues?: WithId<AnyVenue>[];
  reactions?: WithId<Reaction>[];
  screeningRoomVideos: WithId<ScreeningRoomVideo>[];
  animatemapFirebarrels: WithId<Firebarrel>[];
  animatemapArtcars: WithId<ArtCar>[];
  privateChatMessages?: WithId<PrivateChatMessage>[];
  posterVenues?: WithId<PosterPageVenue>[];
  venueChatMessages?: WithId<VenueChatMessage>[];
  venueJukeboxMessages?: WithId<JukeboxMessage>[];
  venueEvents?: WorldEvent[];
  worldEdit?: WithId<World>[];
}

export interface DistributedCounterValue {
  value: number;
}

export interface DistributedCounterShard {
  count: number;
}
