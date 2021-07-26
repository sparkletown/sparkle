import { strict as assert } from "assert";

import * as faker from "faker";
import chalk from "chalk";
import admin from "firebase-admin";
import { User } from "types/User";

import { FieldValue } from "./helpers";
import { LogFunction, withErrorReporter } from "./log";
import { SimStats } from "./simulator";

// imported type definitions to decrease declaration verbosity
import DocumentReference = admin.firestore.DocumentReference;
import DocumentData = admin.firestore.DocumentData;

const INDEX_PADDING = 4;
const INDEX_BASE = 10 ** INDEX_PADDING + 1;

export type EnterVenueOptions = {
  userRef: DocumentReference<DocumentData>;
  venueId: string;
  log: LogFunction;
};

export const enterVenue = async ({
  userRef,
  venueId,
  log,
}: EnterVenueOptions) => {
  const userId = userRef.id;
  const user = (await userRef.get()).data();

  if (!user) {
    return log(
      chalk`{yellow.inverse WARN} No user with id {green ${userId}} that can enter venue {green ${venueId}}.`
    );
  }

  if (user.enteredVenueIds?.includes(venueId)) {
    return; // already in venue
  }

  log(chalk`User {green ${userId}} entering venue {green ${venueId}}...`);

  await userRef.update({ enteredVenueIds: FieldValue.arrayUnion(venueId) });

  log(
    chalk`{green.inverse DONE} User {green ${userId}} entered {green ${venueId}}.`
  );
};

export type TakeSeatOptions = {
  userRef: DocumentReference<DocumentData>;
  venueRef: DocumentReference<DocumentData>;
  row: number;
  col: number;
  stats: SimStats;
  log: LogFunction;
};

export const takeSeat = async ({
  userRef,
  venueRef,
  stats,
  log,
  row,
  col,
}: TakeSeatOptions) => {
  const venueId = venueRef.id;
  const venueName = (await (await venueRef.get()).data())?.name;

  await enterVenue({ userRef, venueId, log });

  const now = Date.now();

  await Promise.all([
    userRef.update({ lastSeenAt: now, lastSeenIn: { [venueName]: now } }),
    userRef.update({ [`data.${venueId}`]: { row, column: col } }),
  ]);

  stats.relocations = (stats.relocations ?? 0) + 1;

  log(
    chalk`User {green ${userRef.id}} took seat at {dim (row,col)}: ({yellow ${row}},{yellow ${col}})`
  );
};

export type FindUserOptions = {
  partyName: string;
  scriptTag?: string;
};

export type FindUserResult = Promise<User | undefined>;

export const findUser: (options: FindUserOptions) => FindUserResult = async ({
  partyName,
  scriptTag,
}) => {
  let query = admin
    .firestore()
    .collection("users")
    .where("partyName", "==", partyName);

  if (scriptTag) {
    query = query.where("scriptTag", "==", scriptTag);
  }

  const snap = await query.get();
  assert.ok(
    snap.docs.length <= 1,
    chalk(
      `Multiple users found for {magenta partyName}: {green ${partyName}} and {magenta scriptTag}: {green ${scriptTag}}`
    )
  );

  return snap.docs[0]?.data();
};

const checkValidUser: (u?: User) => boolean = (u) =>
  !!(u?.partyName && u?.pictureUrl);

export type EnsureBotUsersOptions = {
  stats: SimStats;
  scriptTag?: string;
  count?: number;
  log: LogFunction;
};

export const ensureBotUsers: (
  options: EnsureBotUsersOptions
) => Promise<DocumentReference<DocumentData>[]> = async ({
  log,
  scriptTag,
  count,
  stats,
}) => {
  assert.ok(scriptTag, "ensureUsers(): {magenta scriptTag} is required");
  assert.ok(
    count && count > 0,
    "ensureUsers(): {magenta count} is required and must be {yellow > 0}"
  );

  const usersRef = admin.firestore().collection("users");

  log(
    chalk`Ensuring there are {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}}`
  );

  const candidates = Array.from({ length: count }, (_, i) => ({
    id: `${scriptTag}-` + `${i + INDEX_BASE}`.padStart(INDEX_PADDING, "0"),
    partyName: faker.name.findName(),
    pictureUrl: faker.internet.avatar(),
    bot: true,
  }));

  const resultUserRefs: DocumentReference<DocumentData>[] = [];

  for (const candidate of candidates) {
    const id = candidate.id;
    const userRef = await usersRef.doc(id);

    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      log(
        chalk`{yellow.inverse WARN} User {green ${id}} doesn't exist, creating...`
      );

      await userRef.set(candidate);
      resultUserRefs.push(userRef);

      stats.usersCreated = (stats.usersCreated ?? 0) + 1;
      log(chalk`{greenBright.inverse DONE} Created user {green ${id}}.`);
      continue;
    }

    const user = userSnap.data();
    if (checkValidUser(user)) {
      log(chalk`Found valid user {green ${id}}.`);
      resultUserRefs.push(userRef);
      continue;
    }

    log(chalk`Found invalid user {green ${id}}, updating...`);

    await userRef.update(candidate);
    resultUserRefs.push(userRef);

    stats.usersUpdated = (stats.usersUpdated ?? 0) + 1;
    log(chalk`{greenBright.inverse DONE} Updated user {green ${id}}.`);
  }

  log(
    chalk`{greenBright.inverse DONE} Ensured {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}} exist.`
  );
  return resultUserRefs;
};

export type RemoveBotUsersOptions = {
  userRefs: DocumentReference<DocumentData>[];
  stats: SimStats;
  log: LogFunction;
};

export const removeBotUsers: (
  options: RemoveBotUsersOptions
) => Promise<void> = async ({ userRefs, log, stats }) => {
  const remove = withErrorReporter(
    { critical: false, verbose: true },
    (ref: DocumentReference) => {
      const promise = ref.delete();
      promise.then(() => (stats.usersRemoved = (stats.usersRemoved ?? 0) + 1));
      return promise;
    }
  );

  for (const userRef of userRefs) {
    const snap = await userRef.get();
    if (!snap.exists) {
      log(
        chalk`{yellow.inverse WARN} No user with id {green ${userRef.id}} exists that can be removed.`
      );
      continue;
    }

    const user = await snap.data();
    if (user?.bot !== true) {
      log(
        chalk`{yellow.inverse WARN} User with id {green ${userRef.id}} isn't marked as bot. Not removing.`
      );
      continue;
    }

    await remove(userRef);
  }
};

export type FindVenueOptions = {
  venueId: string;
  log: LogFunction;
};

export const findVenue: (
  options: FindVenueOptions
) => Promise<DocumentReference<DocumentData> | undefined> = async ({
  venueId,
  log,
}) => {
  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const venueSnap = await venueRef.get();

  if (venueSnap.exists) {
    return venueRef;
  }

  log(
    chalk`{yellow.inverse WARN} venue with id {green ${venueId}} was not found.`
  );

  return;
};
