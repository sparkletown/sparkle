import { WithId } from "utils/id";
import { UserWithLocation } from "types/User";
import firebase from "firebase/app";

import { CacheActions, CacheActionTypes } from "store/actions/Cache";

export type CacheState = {
  usersRecord: Record<string, WithId<UserWithLocation>>;
  usersArray: WithId<UserWithLocation>[];
};

const initialState: CacheState = {
  usersRecord: {},
  usersArray: [],
};

export const cacheReducer = (
  state = initialState,
  action: CacheActions
): CacheState => {
  switch (action.type) {
    case CacheActionTypes.RELOAD_USER_CACHE:
      console.log("reloading user cache");
      firebase
        .firestore()
        .collection("users")
        .get()
        .then((snapshot) => {
          const usersRecord = {} as Record<string, WithId<UserWithLocation>>;

          snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
            const user: WithId<UserWithLocation> = doc.data() as WithId<UserWithLocation>;
            user.id = doc.id;
            usersRecord[doc.id] = user;
          });

          const usersArray = Object.values(usersRecord);

          state.usersArray = usersArray;
          state.usersRecord = usersRecord;

          console.log(snapshot.docs);
          // const data = snapshot.map((doc: firebase.firestore.QueryDocumentSnapshot) => doc.data())
          // state.usersArray = snapshot.docs as unknown as WithId<UserWithLocation>[]
          // state.usersRecord = snapshot.docs.reduce((acc, user) => {
          //   acc[user.id as string]: user as unknown as WithId<UserWithLocation>
          // }) as unknown as Record<string, WithId<UserWithLocation>>
        });

      //not the state that will be update... do async operation above outside and call in with the list of user instead
      return state;

    case CacheActionTypes.UPDATE_USER_CACHE:
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
    default:
      return state;
  }
};
