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
import { WithId, WithoutId } from "utils/id";
import { Tidy } from "./Tidy";

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

type UserWithoutId = Tidy<WithoutId<User>>;

export interface Firestore {
  status: {
    requesting: VenueStatus;
    requested: VenueStatus;
    timestamps: VenueTimestamps;
  };
  data: {
    currentVenue: Venue | PartyMapVenue;
    currentEvent: VenueEvent;
    venueChats: Record<string, RestrictedChatMessage> | null;
    venueEvents: Record<string, VenueEvent>;
    userPurchaseHistory: Record<string, Purchase>;
    partygoers: Record<string, UserWithoutId>;
    users: Record<string, UserWithoutId>;
    privatechats: Record<string, PrivateChatMessage>;
    experiences: Record<string, Experience>;
    eventPurchase: Record<string, Purchase>;
    reactions: Record<string, Reaction>;
    venues?: Record<string, Venue>;
  };
  ordered: {
    currentVenue: Array<WithId<Venue | PartyMapVenue>>;
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
    venues?: Array<WithId<Venue>>;
  };
}
