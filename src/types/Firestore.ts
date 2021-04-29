import { ChatRequest } from "types/ChatRequest";
import { PrivateChatMessage, VenueChatMessage } from "types/chat";
import { Purchase } from "types/Purchase";
import { WithPoster } from "types/posters";
import { Reaction } from "types/reactions";
import { Role } from "types/Role";
import { Table } from "types/Table";
import { User } from "types/User";
import { AnyVenue, PosterVenue, VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { AdminRole } from "hooks/roles";

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
  | "purchases"
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
  chatUsers?: Record<string, User>;
  currentEvent?: Record<string, VenueEvent>;
  currentVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, VenueEvent>;
  currentVenueNG?: AnyVenue;
  eventPurchase?: Record<string, Purchase>;
  events?: Record<string, VenueEvent>;
  experience: Experience;
  parentVenue?: AnyVenue;
  playaVenues?: Record<string, AnyVenue>; // for the admin playa preview
  reactions?: Record<string, Reaction>;
  userModalVisits?: Record<string, UserVisit>;
  userPurchaseHistory?: Record<string, Purchase>;
  userRoles?: Record<string, Role>;
  worldUsers?: Record<string, User>;
  venueChatMessages?: Record<string, VenueChatMessage>;
  venueEvents?: Record<string, VenueEvent>;
  venues?: Record<string, AnyVenue>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  chatRequests?: Array<WithId<ChatRequest>>;
  currentEvent?: Array<WithId<VenueEvent>>;
  currentVenue?: Array<WithId<AnyVenue>>;
  currentVenueEventsNG?: Array<WithId<VenueEvent>>;
  currentVenueNG?: Array<WithId<AnyVenue>>;
  eventPurchase?: Array<WithId<Purchase>>;
  events?: Array<WithId<VenueEvent>>;
  experience: WithId<Experience>;
  parentVenue?: Array<WithId<AnyVenue>>;
  parentVenueEvents?: Array<WithId<VenueEvent>>;
  playaVenues?: Array<WithId<AnyVenue>>;
  reactions?: Array<WithId<Reaction>>;
  siblingVenues?: WithId<AnyVenue>[];
  siblingVenueEvents?: WithId<VenueEvent>[];
  statsOnlineUsers?: Array<WithId<User>>;
  statsOpenVenues?: Array<WithId<AnyVenue>>;
  subvenues?: WithId<AnyVenue>[];
  subvenueEvents?: WithId<VenueEvent>[];
  userModalVisits?: Array<WithId<UserVisit>>;
  userPurchaseHistory?: Array<WithId<Purchase>>;
  privateChatMessages?: Array<WithId<PrivateChatMessage>>;
  posterVenues?: WithId<WithPoster<PosterVenue>>[];
  worldUsers?: Array<WithId<User>>;
  venueChatMessages?: Array<WithId<VenueChatMessage>>;
  venueEvents?: Array<WithId<VenueEvent>>;
  venues?: Array<WithId<AnyVenue>>;
}
