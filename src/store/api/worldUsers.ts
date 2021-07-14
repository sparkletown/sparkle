import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import firebase from "firebase/app";

import {
  extractLocationFromUser,
  User,
  UserLocation,
  UserWithLocation,
  userWithLocationToUser,
} from "types/User";

import { withId, WithId } from "utils/id";

export interface WorldUsersApiArgs {
  relatedLocationIds: string[];
}

export interface WorldUsersData {
  // TODO: this is basically the naive 'copy/paste' data structure that matches the legacy
  //   react-redux-firebase useFirestoreConnect implementation currently. Once we have this in
  //   place/working, we want to refactor it to split the data in a 'smarter'/more efficient way.
  worldUsers: WithId<User>[];
  // @debt worldUsersById should be Partial<Record<string, WithId<User>>>, current kept as is for legacy reasons, but it's technically a typing bug
  worldUsersById: Record<string, WithId<User>>;
  // @debt worldUserLocationsById should be Partial<Record<string, WithId<UserLocation>>>, current kept as is for legacy reasons, but it's technically a typing bug
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
}

const initialState: Readonly<WorldUsersData> = {
  worldUsers: [],
  worldUsersById: {},
  worldUserLocationsById: {},
};

// TODO: https://redux-toolkit.js.org/rtk-query/api/createApi
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#adding-meta-information-to-queries
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#constructing-a-dynamic-base-url-using-redux-state
//   Can we use this to read the sovereignVenueId (or even currentVenueId or maybe all relatedVenueIds as needed) directly out of the state?
//   And even if we can, do we want to? Or keep passing it in through WorldUsersApiArgs? (maybe the latter, as I think then it
//     is used for/relates to the cache key for this data)
// TODO: https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query
export const worldUsersApi = createApi({
  reducerPath: "worldUsersApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    worldUsers: builder.query<WorldUsersData, WorldUsersApiArgs>({
      // The query is not relevant here as the data will be provided via streaming updates.
      // A queryFn returning an empty array is used, with contents being populated via
      // streaming updates below as they are received.
      queryFn: () => ({
        data: initialState,
        // TODO: we can also return error and/or meta here as well as data. Do we need to be able to?
        // error: undefined,
        // meta: undefined,
      }),
      async onCacheEntryAdded(
        { relatedLocationIds },
        { updateCachedData, cacheEntryRemoved }
      ) {
        // TODO: use api/* layer for this?
        const usersCollectionRef = firebase.firestore().collection("users");

        const worldUsersQuery = usersCollectionRef.where(
          "enteredVenueIds",
          "array-contains-any",
          relatedLocationIds
        );

        const unsubscribeListener = worldUsersQuery.onSnapshot((snapshot) => {
          // TODO: implement this properly + cleanup this placeholder stuff
          const added = snapshot
            .docChanges()
            .filter((docChange) => docChange.type === "added").length;

          const removed = snapshot
            .docChanges()
            .filter((docChange) => docChange.type === "removed").length;

          const modified = snapshot
            .docChanges()
            .filter((docChange) => docChange.type === "modified").length;

          console.log(
            "worldUsersApi::worldUsers::snapshot",
            "\n  snapshot.size=",
            snapshot.size,
            "\n  snapshot.docs.length = ",
            snapshot.docs.length,
            "\n  snapshot.docChanges().length",
            snapshot.docChanges().length,
            "\n  snapshot.docChanges() added:",
            added,
            "\n  snapshot.docChanges() removed:",
            removed,
            "\n  snapshot.docChanges() modified:",
            modified
          );

          // TODO: we could likely implement a debounce/throttle here to 'slow down' our writes to redux if we need to
          updateCachedData((draft) => {
            snapshot.docChanges().forEach((change) => {
              // @debt validate/typecast this properly so we don't have to use 'as' to hack the types here
              const user: UserWithLocation = change.doc.data() as UserWithLocation;
              const userId: string = change.doc.id;
              const userWithId: WithId<UserWithLocation> = withId(user, userId);

              const userWithoutLocation: WithId<User> = userWithLocationToUser(
                userWithId
              );

              const userLocation: WithId<UserLocation> = extractLocationFromUser(
                userWithId
              );

              switch (change.type) {
                case "added": {
                  // TODO: theoretically I believe it should never be possible for a duplicate user to end up here from
                  //   this, but I wonder if we should err on the side of caution and combine the added/modified cases to
                  //   always try and find the existing user first? A little extra overhead for potentially a little
                  //   more safety.
                  draft.worldUsers.push(userWithoutLocation);
                  draft.worldUsersById[userId] = userWithoutLocation;
                  draft.worldUserLocationsById[userId] = userLocation;

                  return;
                }

                case "modified": {
                  const existingUserIndex = draft.worldUsers.findIndex(
                    (existingUser) => existingUser.id === userWithId.id
                  );

                  if (existingUserIndex !== -1) {
                    draft.worldUsers[existingUserIndex] = userWithoutLocation;
                  } else {
                    // TODO: handle this case in a better way. Maybe Bugsnag or similar? Or maybe just combine the logic
                    //   for added/modified to handle it gracefully if it occurs. It's an edgecase and implies redux store
                    //   corruption IMO. Shouldn't be possible if our update logic here is correct I don't believe.
                    console.warn(
                      `[worldUsersApi::snapshot::modified] Snapshot was 'modified' yet couldn't find index for userId=${userWithId.id}. This shouldn't happen.`
                    );
                  }

                  draft.worldUsersById[userId] = userWithoutLocation;
                  draft.worldUserLocationsById[userId] = userLocation;

                  return;
                }

                case "removed": {
                  const existingUserIndex = draft.worldUsers.findIndex(
                    (existingUser) => existingUser.id === userWithId.id
                  );

                  if (existingUserIndex !== -1) {
                    draft.worldUsers.splice(existingUserIndex, 1);
                  } else {
                    // TODO: handle this case in a better way. Maybe Bugsnag or similar? Or maybe it's fine that the
                    //  user didn't exist in our redux store, since we were just going to remove them anyway. It's an
                    //  edgecase and implies redux store corruption IMO. Shouldn't be possible if our update logic here
                    //  is correct I don't believe.
                    console.warn(
                      `[worldUsersApi::snapshot::removed] Snapshot was 'removed' yet couldn't find index for userId=${userWithId.id}. This shouldn't happen.`
                    );
                  }

                  delete draft.worldUsersById[userId];
                  delete draft.worldUserLocationsById[userId];

                  return;
                }
              }
            });
          });
        });

        await cacheEntryRemoved;

        unsubscribeListener();
      },
    }),
  }),
});

// TODO: https://redux-toolkit.js.org/rtk-query/api/created-api/hooks
// TODO: https://redux-toolkit.js.org/rtk-query/api/created-api/hooks#skiptoken
export const {
  useWorldUsersQuery,
  useLazyWorldUsersQuery,
  usePrefetch,
} = worldUsersApi;
