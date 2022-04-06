import * as fs from "firebase/firestore";
import { debounce, omit, uniqBy } from "lodash";

import {
  COLLECTION_USER_PRESENCE,
  FIELD_SPACE_ID,
  USER_PRESENCE_DEBOUNCE_INTERVAL,
} from "settings";

import { SpaceId } from "types/id";
import { UserPresenceDocument } from "types/userPresence";

import { withIdConverter } from "utils/converters";
import { dataWithId } from "utils/query";

export const getPresenceCollectionRef = () => {
  const converter = withIdConverter<UserPresenceDocument>();
  const firestore = fs.getFirestore();
  return fs
    .collection(firestore, COLLECTION_USER_PRESENCE)
    .withConverter(converter);
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
  spaceId: SpaceId;
  limit?: number;
  debounceInterval?: number;
  callback: (docs: UserPresenceDocument[]) => void;
}

export const subscribeToCheckIns: (
  options: subscribeToCheckInsOptions
) => fs.Unsubscribe = ({
  spaceId,
  limit,
  debounceInterval = USER_PRESENCE_DEBOUNCE_INTERVAL,
  callback,
}) => {
  const collection = getPresenceCollectionRef();

  const queryOptions = [];
  if (limit) {
    queryOptions.push(fs.limit(limit));
  }

  const query = fs.query(
    collection,
    fs.where(FIELD_SPACE_ID, "==", spaceId),
    fs.orderBy("firstSeenAt", "desc"),
    ...queryOptions
  );

  const onNext = debounce((snap: fs.QuerySnapshot<UserPresenceDocument>) => {
    const users = snap.docs.map(dataWithId);
    const dedupedUsers = uniqBy(users, ({ userId }) => userId);
    callback(dedupedUsers);
  }, debounceInterval);

  const onError = (err: fs.FirestoreError) => {
    console.error(err);
  };

  const unsubscribe = fs.onSnapshot(query, onNext, onError);

  return unsubscribe;
};
