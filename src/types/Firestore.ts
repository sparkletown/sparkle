import { Venue } from "./Venue";
import { Purchase } from "./Purchase";
import { User } from "./User";
import {
  RestrictedChatMessage,
  PrivateChatMessage,
} from "components/context/ChatContext";
import { VenueEvent } from "./VenueEvent";

interface VenueStatus {
  currentVenue: boolean;
  venueChats: boolean;
  venueEvents: boolean;
  userPurchaseHistory: boolean;
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
  };
  ordered: {
    currentVenue: Array<Venue>;
    venueChats: Array<RestrictedChatMessage>;
    venueEvents: Array<VenueEvent>;
    userPurchaseHistory: Array<Purchase>;
    partygoers: Array<User>;
    users: Array<User>;
    privatechats: Array<PrivateChatMessage>;
  };
}
