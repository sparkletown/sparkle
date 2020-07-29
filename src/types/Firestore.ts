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
    currentVenue: Array<Venue>;
    venueChats: Array<RestrictedChatMessage>;
    venueEvents: Array<VenueEvent>;
    userPurchaseHistory: Array<Purchase>;
    partygoers: Array<User>;
    users: Array<User>;
    privatechats: Array<PrivateChatMessage>;
    experiences: Array<Experience>;
  };
}
