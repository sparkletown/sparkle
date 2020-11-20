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

interface UserVisit {
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
  allowAllRoles?: Record<string, Role>;
  allUsers?: Record<string, User>;
  chatUsers?: Record<string, User>;
  currentEvent?: Record<string, VenueEvent>;
  currentVenue?: AnyVenue;
  currentVenueEventsNG?: Record<string, VenueEvent>;
  currentVenueNG?: AnyVenue;
  eventPurchase?: Record<string, Purchase>;
  events?: Record<string, VenueEvent>;
  experiences?: Record<string, Experience>;
  parentVenue?: AnyVenue;
  partygoers?: Record<string, User>;
  playaVenues?: Record<string, AnyVenue>; // for the admin playa preview
  privatechats?: Record<string, PrivateChatMessage>;
  reactions?: Record<string, Reaction>;
  userModalVisits?: Record<string, UserVisit>;
  userPurchaseHistory?: Record<string, Purchase>;
  userRoles?: Record<string, Role>;
  users?: Record<string, User>;
  venueChats?: Record<string, RestrictedChatMessage> | null;
  venueEvents?: Record<string, VenueEvent>;
  venues?: Record<string, AnyVenue>;
}

// note: these entries should be sorted alphabetically
export interface FirestoreOrdered {
  allUsers?: WithId<User>[];
  chatRequests?: WithId<ChatRequest>[];
  currentEvent?: WithId<VenueEvent>[];
  currentVenue?: WithId<AnyVenue>[];
  currentVenueEventsNG?: WithId<VenueEvent>[];
  currentVenueNG?: WithId<AnyVenue>[];
  eventPurchase?: WithId<Purchase>[];
  events?: WithId<VenueEvent>[];
  experiences?: WithId<Experience>[];
  partygoers?: WithId<User>[];
  playaVenues?: WithId<AnyVenue>[];
  privatechats?: WithId<PrivateChatMessage>[];
  reactions?: WithId<Reaction>[];
  statsOnlineUsers?: WithId<User>[];
  statsOpenVenues?: WithId<AnyVenue>[];
  userModalVisits?: WithId<UserVisit>[];
  userPurchaseHistory?: WithId<Purchase>[];
  users?: WithId<User>[];
  venueChats?: WithId<RestrictedChatMessage>[];
  venueEvents?: WithId<VenueEvent>[];
  venues?: WithId<AnyVenue>[];
}
