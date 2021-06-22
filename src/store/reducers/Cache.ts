//import { CacheActions } from "../actions/Cache";
import { WithId } from "utils/id";

import { User } from "types/User";

import firebase from "firebase/app";
//import "firebase/firestore";

interface cacheState {
  usersRecord: Record<string, WithId<User>>;
  usersArray: WithId<User>[];
}

const initialState: cacheState = {
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
  if (action.type === "cache/updateUser") {
    console.log("update cache");
    console.dir(action);
  }
  return state;
};
