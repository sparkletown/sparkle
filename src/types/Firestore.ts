import { Venue } from "./Venue";
import { Purchase } from "./Purchase";
import { User } from "./User";
import {
  RestrictedChatMessage,
  PrivateChatMessage,
} from "components/context/ChatContext";
import { VenueEvent } from "./VenueEvent";
import { Table } from "./Table";
import { PartyMapVenue } from "./PartyMapVenue";
import { Reaction } from "components/context/ExperienceContext";
import { WithId } from "utils/id";
import { CampVenue } from "./CampVenue";
import { ChatRequest } from "./ChatRequest";
import { Role } from "./Role";

interface VenueStatus {
  currentVenue: boolean;
  currentEvent: boolean;
  eventPurchase: boolean;
  venueChats: boolean;
  venueEvents: boolean;
  userPurchaseHistory: boolean;
}

interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Table>;
}

type VenueTimestamps = Record<keyof VenueStatus, number>;
export type AnyVenue = Venue | PartyMapVenue | CampVenue;

interface UserVisit {
  timeSpent: number;
}

export interface Firestore {
  status: {
    requesting: VenueStatus;
    requested: VenueStatus;
    timestamps: VenueTimestamps;
  };
  data: {
    currentVenue?: AnyVenue;
    currentEvent: Record<string, VenueEvent>;
    venueChats: Record<string, RestrictedChatMessage> | null;
    venueEvents: Record<string, VenueEvent>;
    userPurchaseHistory: Record<string, Purchase>;
    partygoers: Record<string, User>;
    users: Record<string, User>;
    privatechats: Record<string, PrivateChatMessage>;
    experiences: Record<string, Experience>;
    eventPurchase: Record<string, Purchase>;
    reactions: Record<string, Reaction>;
    venues?: Record<string, AnyVenue>;
    events?: Record<string, VenueEvent>;
    playaVenues?: Record<string, AnyVenue>; // for the admin playa preview
    allUsers?: Record<string, User>;
    userModalVisits?: Record<string, UserVisit>;
    userRoles: Record<string, Role>;
    allowAllRoles: Record<string, Role>;
  };
  ordered: {
    currentVenue: Array<WithId<AnyVenue>>;
    currentEvent: Array<WithId<VenueEvent>>;
    venueChats: Array<WithId<RestrictedChatMessage>>;
    venueEvents: Array<WithId<VenueEvent>>;
    userPurchaseHistory: Array<WithId<Purchase>>;
    partygoers: Array<WithId<User>>;
    users: Array<WithId<User>>;
    privatechats: Array<WithId<PrivateChatMessage>>;
    experiences: Array<WithId<Experience>>;
    eventPurchase: Array<WithId<Purchase>>;
    reactions: Array<WithId<Reaction>>;
    venues?: Array<WithId<AnyVenue>>;
    events?: Array<WithId<VenueEvent>>;
    playaVenues?: Array<WithId<AnyVenue>>;
    statsOnlineUsers?: Array<WithId<User>>;
    statsOpenVenues?: Array<WithId<AnyVenue>>;
    allUsers?: Array<WithId<User>>;
    userModalVisits?: Array<WithId<UserVisit>>;
    chatRequests?: Array<WithId<ChatRequest>>;
  };
}
