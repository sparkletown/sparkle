import { WithId } from "utils/id";
import { AdminRole } from "hooks/roles";

import {
  RestrictedChatMessage,
  PrivateChatMessage,
} from "components/context/ChatContext";
import { Reaction } from "components/context/ExperienceContext";

import { CampVenue } from "./CampVenue";
import { ChatRequest } from "./ChatRequest";
import { PartyMapVenue } from "./PartyMapVenue";
import { Purchase } from "./Purchase";
import { Role } from "./Role";
import { Table } from "./Table";
import { User } from "./User";
import { Venue } from "./Venue";
import { VenueEvent } from "./VenueEvent";

export type AnyVenue = Venue | PartyMapVenue | CampVenue;

interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Table>;
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
  adminRole: AdminRole;
  allowAllRoles: Record<string, Role>;
  allUsers?: Record<string, User>;
  chatUsers?: Record<string, User>;
  currentEvent: Record<string, VenueEvent>;
  currentVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, VenueEvent>;
  currentVenueNG?: AnyVenue;
  eventPurchase: Record<string, Purchase>;
  events?: Record<string, VenueEvent>;
  experiences: Record<string, Experience>;
  parentVenue?: AnyVenue;
  partygoers?: Record<string, User>;
  playaVenues?: Record<string, AnyVenue>; // for the admin playa preview
  privatechats: Record<string, PrivateChatMessage>;
  reactions: Record<string, Reaction>;
  userModalVisits?: Record<string, UserVisit>;
  userPurchaseHistory: Record<string, Purchase>;
  userRoles: Record<string, Role>;
  users: Record<string, User>;
  venueChats: Record<string, RestrictedChatMessage> | null;
  venueEvents: Record<string, VenueEvent>;
  venues?: Record<string, AnyVenue>;
  venueChatUsers?: Record<string, User>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  allUsers?: Array<WithId<User>>;
  chatRequests?: Array<WithId<ChatRequest>>;
  currentEvent: Array<WithId<VenueEvent>>;
  currentVenue: Array<WithId<AnyVenue>>;
  currentVenueEventsNG?: Array<WithId<VenueEvent>>;
  currentVenueNG?: Array<WithId<AnyVenue>>;
  eventPurchase: Array<WithId<Purchase>>;
  events?: Array<WithId<VenueEvent>>;
  experiences: Array<WithId<Experience>>;
  parentVenue?: Array<WithId<AnyVenue>>;
  parentVenueEvents?: Array<WithId<VenueEvent>>;
  partygoers?: Array<WithId<User>>;
  playaVenues?: Array<WithId<AnyVenue>>;
  privatechats?: Array<WithId<PrivateChatMessage>>;
  reactions: Array<WithId<Reaction>>;
  siblingVenues?: WithId<AnyVenue>[];
  siblingVenueEvents?: WithId<VenueEvent>[];
  statsOnlineUsers?: Array<WithId<User>>;
  statsOpenVenues?: Array<WithId<AnyVenue>>;
  subvenues?: WithId<AnyVenue>[];
  subvenueEvents?: WithId<VenueEvent>[];
  userModalVisits?: Array<WithId<UserVisit>>;
  userPurchaseHistory: Array<WithId<Purchase>>;
  users: Array<WithId<User>>;
  venueChats: Array<WithId<RestrictedChatMessage>>;
  venueEvents: Array<WithId<VenueEvent>>;
  venues?: Array<WithId<AnyVenue>>;
  venueChatUsers?: Array<WithId<User>>;
}
