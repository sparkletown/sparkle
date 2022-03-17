import { useMemo } from "react";
import { useAsync } from "react-use";
import { useFirestore } from "reactfire";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { chunk } from "lodash";

import { COLLECTION_USERS, FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS } from "settings";

import { UserId, UserWithId } from "types/id";

import { convertToFirestoreKey } from "utils/id";

type UseProfileByIds = (options: {
  userIds: UserId[];
}) => UserWithId[] | undefined;

export const useProfileByIds: UseProfileByIds = ({ userIds }) => {
  const firestore = useFirestore();

  const usersRequests = useMemo(
    () =>
      chunk(userIds, FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS).map((usersChunk) =>
        getDocs(
          query(
            collection(firestore, COLLECTION_USERS),
            where(
              documentId(),
              "in",
              usersChunk.map((userId) => convertToFirestoreKey(userId))
            )
          )
        )
      ),
    [firestore, userIds]
  );

  const { value: usersSnapshots } = useAsync(
    async () => await Promise.all(usersRequests),
    [usersRequests]
  );

  const users = useMemo(
    () =>
      usersSnapshots?.flatMap((usersSnapshot) =>
        usersSnapshot.docs.map(
          (userSnapshot) =>
            ({
              ...userSnapshot.data(),
              id: userSnapshot.id,
            } as UserWithId)
        )
      ),
    [usersSnapshots]
  );

  return users;
};
