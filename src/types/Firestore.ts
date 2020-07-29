import { Venue } from "./Venue";
import { Purchase } from "./Purchase";
import { User } from "./User";
import { RestrictedChatMessage } from "components/context/ChatContext";

interface VenueStatus {
  currentVenue: boolean;
  venueChats: boolean;
  venueEvents: boolean;
  userPurchaseHistory: boolean;
}

type VenueTimestamps = Record<keyof VenueStatus, number>;

interface VenueEvent {
  name: string;
  price: number;
  descriptions: Array<string>;
  collective_price: number;
  start_utc_seconds: number;
  duration_minutes: number;
}

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
  };
  ordered: {
    currentVenue: Array<Venue>;
    venueChats: Array<RestrictedChatMessage>;
    venueEvents: Array<VenueEvent>;
    userPurchaseHistory: Array<Purchase>;
    partygoers: Array<User>;
    users: Array<User>;
  };
}
