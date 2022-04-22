import * as fs from "firebase/firestore";
import { debounce, groupBy, mapValues, omit, uniqBy } from "lodash";

import {
  COLLECTION_USER_PRESENCE,
  FIELD_SPACE_ID,
  USER_PRESENCE_DEBOUNCE_INTERVAL,
} from "settings";

import { SpaceId } from "types/id";
import { UserPresenceDocument } from "types/userPresence";

/*
 * This converter copies the userId field on to the ID field of the object
 * returned from the database so that it can be used like a User object.
 */
const userPresenceConverter = {
  toFirestore: (value: UserPresenceDocument): fs.DocumentData => value,
  fromFirestore: (
    snapshot: fs.QueryDocumentSnapshot,
    options?: fs.SnapshotOptions
  ) => {
    const data = snapshot.data();
    return { ...data, id: data.userId } as UserPresenceDocument;
  },
};

export const getPresenceCollectionRef = () => {
  const firestore = fs.getFirestore();
  return fs
    .collection(firestore, COLLECTION_USER_PRESENCE)
    .withConverter(userPresenceConverter);
};

type UserPresenceUpdatePayload = Omit<
  UserPresenceDocument,
  "id" | "firstSeenAt"
> & {
  firstSeenAt?: number;
};

const getCheckInDoc = (checkInId?: string) => {
  if (checkInId) {
    return fs.doc(fs.getFirestore(), COLLECTION_USER_PRESENCE, checkInId);
  }
  return fs.doc(fs.collection(fs.getFirestore(), COLLECTION_USER_PRESENCE));
};

type doCheckInOptions = Omit<
  UserPresenceDocument,
  "id" | "firstSeenAt" | "lastSeenAt"
> & {
  id: string | undefined;
};

export const doCheckIn: (
  options: doCheckInOptions
) => Promise<string> = async ({ id, ...options }) => {
  const doc = getCheckInDoc(id);

  const payload: UserPresenceUpdatePayload = {
    ...omit(options, "checkInId", "firstSeenAt", "lastSeenAt"),
    lastSeenAt: Date.now(),
  };
  if (!id) {
    payload.firstSeenAt = Date.now();
  }

  await fs.setDoc(doc, payload, { merge: true });

  return doc.id;
};

export const removeCheckIn: (checkInId: string) => Promise<void> = async (
  checkInId
) => {
  const doc = getCheckInDoc(checkInId);
  await fs.deleteDoc(doc);
};

interface subscribeToCheckInsOptions {
  spaceIds: SpaceId[];
  limit?: number;
  debounceInterval?: number;
  callback: (docs: { [spaceId: SpaceId]: UserPresenceDocument[] }) => void;
}

export const subscribeToCheckIns: (
  options: subscribeToCheckInsOptions
) => fs.Unsubscribe = ({
  spaceIds,
  limit,
  debounceInterval = USER_PRESENCE_DEBOUNCE_INTERVAL,
  callback,
}) => {
  const collection = getPresenceCollectionRef();

  const queryOptions = [];
  if (limit) {
    queryOptions.push(fs.limit(limit));
  }

  if (spaceIds.length > 10) {
    console.error(
      "Too many space IDs provided. Firebase limits to 10 items in an IN query. Truncating"
    );
    spaceIds.splice(10);
  }

  if (!spaceIds.length) {
    return () => {};
  }

  const query = fs.query(
    collection,
    fs.where(FIELD_SPACE_ID, "in", spaceIds),
    fs.orderBy("firstSeenAt", "desc"),
    ...queryOptions
  );

  const onNext = debounce((snap: fs.QuerySnapshot<UserPresenceDocument>) => {
    const users = snap.docs.map((doc) => doc.data());
    const uniqueUsersBySpace = mapValues(
      groupBy(users, ({ spaceId }) => spaceId),
      (users) => uniqBy(users, ({ userId }) => userId)
    );
    callback(uniqueUsersBySpace);
  }, debounceInterval);

  const onError = (err: fs.FirestoreError) => {
    console.error(err);
  };

  const unsubscribe = fs.onSnapshot(query, onNext, onError);

  return unsubscribe;
};
