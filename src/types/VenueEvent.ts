import { WithId } from "utils/id";
import { Venue } from "./Venue";

export interface VenueEvent {
  name: string;
  start_utc_seconds: number;
  description: string;
  descriptions?: string[];
  duration_minutes: number;
  price: number;
  collective_price: number;
  host: string;
  room?: string;
  id?: string;
}

export type AdminVenueDetailsPartProps = {
  venue: WithId<Venue>;
  roomIndex?: number;
  showCreateEventModal: boolean;
  setShowCreateEventModal: Function;
  setShowDeleteEventModal: Function;
  editedEvent?: WithId<VenueEvent>;
  setEditedEvent?: Function;
};

export type RoomVenueDetailsPartProps = {
  venue: WithId<Venue>;
  roomIndex?: number;
  showCreateEventModal: boolean;
  setShowCreateEventModal: Function;
  editedEvent?: WithId<VenueEvent>;
  setEditedEvent?: Function;
};
