import { Venue } from "./Venue";
import { Purchase } from "./Purchase";
import { User } from "./User";
import {
  RestrictedChatMessage,
  PrivateChatMessage,
} from "components/context/ChatContext";
import { VenueEvent } from "./VenueEvent";
import { Table } from "./Table";

interface VenueStatus {
  currentVenue: boolean;
  venueChats: boolean;
  venueEvents: boolean;
  userPurchaseHistory: boolean;
}

interface Reaction {
  created_at: number;
  created_by: string;
  reaction: string;
}

interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Table>;
}

type VenueTimestamps = Record<keyof VenueStatus, number>;

type OrderedIdEnhancer<T extends object> = { id: string } & T;

export interface Firestore {
  status: {
    requesting: VenueStatus;
    requested: VenueStatus;
    timestamps: VenueTimestamps;
  };
  data: {
    currentVenue: Venue;
    venueChats: Record<string, RestrictedChatMessage> | null;
    venueEvents: Record<string, VenueEvent>;
    userPurchaseHistory: Record<string, Purchase>;
    partygoers: Record<string, User>;
    users: Record<string, User>;
    privatechats: Record<string, PrivateChatMessage>;
    experiences: Record<string, Experience>;
  };
  ordered: {
    currentVenue: Array<OrderedIdEnhancer<Venue>>;
    venueChats: Array<OrderedIdEnhancer<RestrictedChatMessage>>;
    venueEvents: Array<OrderedIdEnhancer<VenueEvent>>;
    userPurchaseHistory: Array<OrderedIdEnhancer<Purchase>>;
    partygoers: Array<OrderedIdEnhancer<User>>;
    users: Array<OrderedIdEnhancer<User>>;
    privatechats: Array<OrderedIdEnhancer<PrivateChatMessage>>;
    experiences: Array<OrderedIdEnhancer<Experience>>;
  };
}
