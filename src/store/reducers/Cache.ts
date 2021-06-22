//import { CacheActions } from "../actions/Cache";
import { VenueEvent } from "types/venues";
import { WithId, WithVenueId } from "utils/id";

interface cacheState {
  events: Promise<WithVenueId<WithId<VenueEvent>>[]>;
}

const initialState: cacheState = {
  events: fetch(
    "https://firebasestorage.googleapis.com/v0/b/sparkle-ohbm.appspot.com/o/assets%2Fcache%2Fevents.json?alt=media&token=d190d1c3-249d-4f05-ad33-ae349c8771c2"
  ).then((res) => res.json()),
};

export const cacheReducer = (
  state = initialState
  //action: cacheActions
): cacheState => state;
