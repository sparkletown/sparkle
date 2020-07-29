import { Venue } from "./Venue";
import { Purchase } from "./Purchase";
import { User } from "./User";

interface VenueStatus {
  currentVenue: boolean;
  venueChats: boolean;
  venueEvents: boolean;
  userPurchaseHistory: boolean;
}

type VenueTimestamps = Record<keyof VenueStatus, number>;

interface VenueChat {
  ts_utc: { seconds: number; nanoseconds: number };
  text: string;
  from: string;
  to: string;
  type: string;
}

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
    venueChats: Record<string, VenueChat> | null;
    venueEvents: Record<string, VenueEvent>;
    userPurchaseHistory: Record<string, Purchase>;
    partygoers: Record<string, User>;
  };
  ordered: {
    currentVenue: Array<Venue>;
    venueChats: Array<VenueChat>;
    venueEvents: Array<VenueEvent>;
    userPurchaseHistory: Array<Purchase>;
    partygoers: Array<User>;
  };
}
