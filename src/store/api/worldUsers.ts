import Bugsnag from "@bugsnag/js";
import { MaybeDrafted } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import firebase from "firebase/app";
import { isEqual } from "lodash";

import { WORLD_USERS_UPDATE_INTERVAL } from "settings";

import { User, UserLocation, UserWithLocation } from "types/User";

import { WithId, withId } from "utils/id";

export interface WorldUsersApiArgs {
  relatedLocationIds: string[];
  currentUserId: string;
}

// TODO: If we add recentUserIds to the store here, then we should be able to 'pre-process' that data as it comes in, rather than breaking memo's/etc in the hooks
//   and having to handle processing it all later on.
// TODO: We could follow a similar pattern as used here to separate userLocation out of the user object entirely. Most of the 'groundwork'
//   should already be done in the changes made for this that the 'final step' of doing it would presumably be quite small. This would remove
//   the need for the deep compare's to avoid Immer's draft making patches for data that technically hasn't changed, and would likely simplify
//   the overall logic a bit.
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

export const initialState: Readonly<WorldUsersData> = {
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
      onCacheEntryAdded: async (
        { relatedLocationIds, currentUserId },
        { updateCachedData, cacheEntryRemoved }
      ) => {
        // Used to hold the changes queued from the snapshot listener so that we can process them in batches
        const queuedChanges: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>[] = [];

        const processQueuedChanges = () => {
          if (queuedChanges.length === 0) return;
          console.log(
            "worldUsersApi::processQueuedChanges queuedChanges.length = ",
            queuedChanges.length
          );

          window.performance.mark("worldUsersApi::processQueuedChanges::start");
          updateCachedData((draft) => {
            // We use splice here to remove all elements from the array and return them for processing
            queuedChanges.splice(0).forEach(processUserDocChange(draft));
          });
          window.performance.measure(
            "worldUsersApi::processQueuedChanges",
            "worldUsersApi::processQueuedChanges::start"
          );
        };

        const processQueuedChangesIntervalId = setInterval(
          processQueuedChanges,
          WORLD_USERS_UPDATE_INTERVAL
        );

        const worldUsersQuery = firebase
          .firestore()
          .collection("users")
          .where("enteredVenueIds", "array-contains-any", relatedLocationIds);

        let hasLoadedDataInitially = false;

        const unsubscribeListener = worldUsersQuery.onSnapshot((snapshot) => {
          const snapshotSize = snapshot.size;

          // NOTE: Don't delay the update of the first load.
          if (snapshotSize > 1 && !hasLoadedDataInitially) {
            updateCachedData((draft) => {
              snapshot.docChanges().forEach(processUserDocChange(draft));
            });

            hasLoadedDataInitially = true;
            return;
          }

          snapshot.docChanges().forEach((change) => {
            if (change.doc.id === currentUserId) {
              updateCachedData((draft) => {
                processUserDocChange(draft)(change);
              });
            } else {
              queuedChanges.push(change);
            }
          });
        });

        // Wait until the data no longer needs to be kept in our redux cache
        await cacheEntryRemoved;

        unsubscribeListener();

        clearInterval(processQueuedChangesIntervalId);

        // Make sure we process any last remaining queued changes
        // TODO: do we need to do this? I think we'll only get to this code if we're already planning on clearing the cached data?
        processQueuedChanges();
      },
    }),
  }),
});

// TODO: https://redux-toolkit.js.org/rtk-query/api/created-api/hooks
// TODO: https://redux-toolkit.js.org/rtk-query/api/created-api/hooks#skiptoken
export const {
  useQuery: useWorldUsersQuery,
  useQueryState: useWorldUsersQueryState,
  useQuerySubscription: useWorldUsersQuerySubscription,
} = worldUsersApi.endpoints.worldUsers;

// @debt Not sure if the validations are too 'heavyweight' for this, but object destructuring seemed to work
//  here, whereas the validations seemed to hang my browser tab. There might also be something wrong with the
//  validation rules leading to infinite recursion or similar?
// @debt refactor userWithLocationToUser to optionally not require WithId, then use that in profileSelector
const userWithLocationToUser = (
  user: WithId<UserWithLocation>
): WithId<User> => {
  const { lastVenueIdSeenIn, lastSeenAt, ...userWithoutLocation } = user;

  return userWithoutLocation;
};

const extractLocationFromUserWithLocation = (
  user: WithId<UserWithLocation>
): WithId<UserLocation> => {
  const { lastVenueIdSeenIn, lastSeenAt, enteredVenueIds } = user;

  const userLocation: UserLocation = {
    lastVenueIdSeenIn,
    lastSeenAt,
    enteredVenueIds,
  };

  return withId(userLocation, user.id);
};

const notifyOnDocProcessingError = (
  modificationType: firebase.firestore.DocumentChangeType,
  userId: string,
  msg: string
) => {
  const message =
    `[worldUsersApi::snapshot::${modificationType}] ` +
    `Snapshot was '${modificationType}' yet ` +
    msg +
    " This should not happen.";
  console.warn(message);
  Bugsnag.notify(message, (event) => {
    event.addMetadata("context", {
      location: `api/worldUsers::snapshot::${modificationType}`,
      userId,
      message,
    });
  });
};

const processUserDocChange = (draft: MaybeDrafted<WorldUsersData>) => (
  change: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>
) => {
  // @debt validate/typecast this properly so we don't have to use 'as' to hack the types here
  const user: UserWithLocation = change.doc.data() as UserWithLocation;
  const userId: string = change.doc.id;
  const userWithLocation: WithId<UserWithLocation> = withId(user, userId);

  const userWithoutLocation: WithId<User> = userWithLocationToUser(
    userWithLocation
  );

  const userLocation: WithId<UserLocation> = extractLocationFromUserWithLocation(
    userWithLocation
  );

  const existingUserIndex = draft.worldUsers.findIndex(
    (existingUser) => existingUser.id === userWithLocation.id
  );

  switch (change.type) {
    case "added": {
      if (existingUserIndex !== -1) {
        notifyOnDocProcessingError(
          change.type,
          userId,
          `an existing user with the same userId=${userId} was found.`
        );
      }
      draft.worldUsers.push(userWithoutLocation);
      draft.worldUsersById[userId] = userWithoutLocation;
      draft.worldUserLocationsById[userId] = userLocation;

      return;
    }

    case "modified": {
      if (existingUserIndex !== -1) {
        if (!isEqual(draft.worldUsers[existingUserIndex], userWithoutLocation))
          draft.worldUsers[existingUserIndex] = userWithoutLocation;
      } else {
        notifyOnDocProcessingError(
          change.type,
          userId,
          `couldn't find index for userId=${userId}.`
        );
      }

      if (!isEqual(draft.worldUsersById[userId], userWithoutLocation))
        draft.worldUsersById[userId] = userWithoutLocation;

      // @debt It seems like Immer's draft will produce 'patches' for this chunk of data even if it hasn't actually changed,
      //   so it might be beneficial to check it with a deep compare here first, and only modify the draft if the data has actually changed.
      //   Though in this particular case, the userLocation is almost always the thing that will be changing, so the extra comparisons here
      //   might be more 'costly' than just always updating this.
      draft.worldUserLocationsById[userId] = userLocation;
      // if (
      //   isEqual(draft.worldUserLocationsById[userId], userLocation)
      // ) {
      //   console.warn(
      //     `[worldUsersApi::snapshot::modified] userId=${userWithId.id} userLocation matches data within worldUserLocationsById. We shouldn't need to update the draft here`
      //   );
      // } else {
      //
      // }

      return;
    }

    case "removed": {
      const existingUserIndex = draft.worldUsers.findIndex(
        (existingUser) => existingUser.id === userWithLocation.id
      );

      if (existingUserIndex !== -1) {
        draft.worldUsers.splice(existingUserIndex, 1);
      } else {
        notifyOnDocProcessingError(
          change.type,
          userId,
          `couldn't find index for userId=${userWithLocation.id}.`
        );
      }

      delete draft.worldUsersById[userId];
      delete draft.worldUserLocationsById[userId];

      return;
    }
  }
};
