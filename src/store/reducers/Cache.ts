//import { CacheActions } from "../actions/Cache";
import { VenueEvent } from "types/venues";
import { WithId, WithVenueId } from "utils/id";

//import firebase from "firebase/app";
//import "firebase/storage";

import { SCHEDULE_LOAD_FROM_GS } from "settings";

interface cacheState {
  events: Promise<WithVenueId<WithId<VenueEvent>>[]>;
}

const initialState: cacheState = {
  events: new Promise(async (resolve) => {
    //const storage = firebase.storage();
    //const url = await storage.ref().child(SCHEDULE_LOAD_FROM_GS).getDownloadURL();
    fetch(SCHEDULE_LOAD_FROM_GS)
      .then((res) => res.json())
      .then(resolve);
  }),
};

export const cacheReducer = (
  state = initialState
  //action: cacheActions
): cacheState => state;
