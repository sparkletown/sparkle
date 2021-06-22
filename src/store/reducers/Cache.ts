//import { CacheActions } from "../actions/Cache";
import { VenueEvent } from "types/venues";
import { WithId, WithVenueId } from "utils/id";

import { User } from "types/User";

import firebase from "firebase/app";
//import "firebase/firestore";

import { SCHEDULE_LOAD_FROM_GS } from "settings";

interface cacheState {
  events: Promise<WithVenueId<WithId<VenueEvent>>[]>;
  usersRecord: Record<string, WithId<User>>;
  usersArray: WithId<User>[];
}

const initialState: cacheState = {
  events: new Promise(async (resolve) => {
    //const storage = firebase.storage();
    //const url = await storage.ref().child(SCHEDULE_LOAD_FROM_GS).getDownloadURL();
    fetch(SCHEDULE_LOAD_FROM_GS)
      .then((res) => res.json())
      .then(resolve);
  }),
  usersRecord: {},
  usersArray: [],
};

interface CacheActions {
  type: string;
}

export const cacheReducer = (
  state = initialState,
  action: CacheActions
): cacheState => {
  if (action.type === "cache/reloadUsers") {
    console.log("caching users!------------------------");
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          const user: WithId<User> = doc.data() as WithId<User>;
          user.id = doc.id;
          state.usersRecord[doc.id] = user;
          state.usersArray = Object.values(state.usersRecord);
        });
      });
  }
  return state;
};
