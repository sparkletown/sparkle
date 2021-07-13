import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import firebase from "firebase/app";

export interface WorldUsersApiArgs {
  relatedLocationIds: string[];
}

// TODO: define this properly
export interface WorldUsersData {
  userIds?: string[];
}

// TODO: https://redux-toolkit.js.org/rtk-query/api/createApi
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
// TODO: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
// TODO: https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query
export const worldUsersApi = createApi({
  reducerPath: "worldUsersApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    worldUsers: builder.query<WorldUsersData, WorldUsersApiArgs>({
      // The query is not relevant here as the data will be provided via streaming updates.
      // A queryFn returning an empty array is used, with contents being populated via
      // streaming updates below as they are received.
      queryFn: () => ({ data: {} }),
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
          // TODO: refactor this to use .map/etc so it only needs to call updateCachedData once?
          //  And/or do the .forEach within the updateCachedData?

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
            snapshot.size,
            snapshot.docs.length,
            snapshot.docChanges().length,
            "added:",
            added,
            "removed:",
            removed,
            "modified:",
            modified
          );

          // TODO: we could likely implement a debounce/throttle here to 'slow down' our writes to redux if we need to

          snapshot.docChanges().forEach((change) => {
            // const docId = change.doc.id;
            // const docData = change.doc.data();

            switch (change.type) {
              case "added":
              case "modified":
                // TODO
                updateCachedData((draft) => {
                  if (!draft?.userIds) {
                    draft.userIds = [];
                  }

                  draft.userIds.push(change.doc.id);
                });
                break;

              case "removed":
                // TODO
                // updateCachedData((draft) => {
                //   // draft.push(JSON.parse(event.data));
                // });
                break;
            }
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
