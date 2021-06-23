import { WithId } from "utils/id";
import { User } from "types/User";
import firebase from "firebase/app";

import { CacheActions, CacheActionTypes } from "store/actions/Cache";

export type CacheState = {
  usersRecord: Record<string, WithId<User>>;
  usersArray: WithId<User>[];
};

const initialState: CacheState = {
  usersRecord: {},
  usersArray: [],
};

export const cacheReducer = (
  state = initialState,
  action: CacheActions
): CacheState => {
  console.log("cacheReduer", action.type);
  switch (action.type) {
    case CacheActionTypes.RELOAD_USER_CACHE:
      console.log("reloading user cache");
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

      //not the state that will be update... do async operation above outside and call in with the list of user instead
      return state;

    case CacheActionTypes.UPDATE_USER_CACHE:
      /*
      const user = state.usersRecord[action.payload.id];
      Object.assign(user, action.payload.user);

      const idx = state.usersArray.find(u=>u.id == action.payload.id);
      if(idx) state.usersArray[idx] = action.payload.user;
      */
      //console.log("action.payload", action.payload.id);
      return {
        ...state,
        usersRecord: {
          ...state.usersRecord,
          [action.payload.id]: action.payload.user,
        },
        usersArray: state.usersArray.map((u) => {
          //console.log(u.id);

          if (u.id !== action.payload.id) return u; //don't change
          return action.payload.user;
        }),
      };
    /*
    case CacheActionTypes.INVALIDATE_USER_CACHE:
      console.log("invalidating", action);
      firebase
        .firestore()
        .collection("users").doc(action.payload.id).get()
        .then((doc: firebase.firestore.DocumentSnapshot)=>{
          const user: WithId<User> = doc.data() as WithId<User>;
          user.id = doc.id;
          state.usersRecord[doc.id] = user;
          state.usersArray = Object.values(state.usersRecord);
          console.log("updated to", user.data);
        });
      break;
    */
    default:
      return state;
  }
};
