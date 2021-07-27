import { strict as assert } from "assert";

import * as faker from "faker";
import chalk from "chalk";
import admin from "firebase-admin";
import { User } from "types/User";

import { FieldValue } from "./helpers";
import { LogFunction, withErrorReporter } from "./log";
import { SimStats, SimConfig } from "./simulator";

// import type definitions to decrease declaration verbosity
import CollectionReference = admin.firestore.CollectionReference;
import DocumentData = admin.firestore.DocumentData;
import DocumentReference = admin.firestore.DocumentReference;
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;

const INDEX_PADDING = 4;
const INDEX_BASE = 10 ** INDEX_PADDING + 1;

// @see EmojiReactionType in types/reactions
// noinspection SpellCheckingInspection
const REACTIONS = Object.freeze([
  "heart",
  "clap",
  "wolf",
  "laugh",
  "thatsjazz",
  "boo",
  "burn",
  "sparkle",
  "messageToTheBand",
]);

const TEXTERS = Object.freeze([
  faker.hacker.phrase,
  faker.company.catchPhrase,
  faker.company.bs,
  faker.lorem.sentence,
  faker.random.words,
]);

const generateRandomReaction = () =>
  REACTIONS[Math.floor(Math.random() * REACTIONS.length)];

const generateRandomText = () =>
  TEXTERS[Math.floor(Math.random() * TEXTERS.length)]();

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

export const takeSeat: (options: TakeSeatOptions) => Promise<void> = async ({
  userRef,
  venueRef,
  stats,
  log,
  row,
  col,
}) => {
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
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
};

export const removeBotUsers: (
  options: RemoveBotUsersOptions
) => Promise<void> = async ({ userRefs, conf, log, stats }) => {
  const remove = withErrorReporter(conf.log, (userRef: DocumentReference) => {
    const promise = userRef.delete();
    promise.then(() => {
      log(
        chalk`{green.inverse DONE} Removed user with id {green ${userRef.id}}.`
      );
      stats.usersRemoved = (stats.usersRemoved ?? 0) + 1;
    });
    return promise;
  });

  for (const userRef of userRefs) {
    const userId = userRef.id;

    const snap: DocumentSnapshot<DocumentData> = await userRef.get();
    if (!snap.exists) {
      log(
        chalk`{yellow.inverse WARN} No user with id {green ${userId}} exists that can be removed.`
      );
      continue;
    }

    const user = await snap.data();
    if (user?.bot !== true) {
      log(
        chalk`{yellow.inverse WARN} User with id {green ${userId}} isn't marked as bot. Not removing.`
      );
      continue;
    }

    log(chalk`Removing user with id {green ${userId}}...`);
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

export type findExperienceReactionsOptions = {
  venueId: string;
};

export const findExperienceReactions: (
  options: findExperienceReactionsOptions
) => Promise<CollectionReference<DocumentData>> = async ({ venueId }) =>
  admin
    .firestore()
    .collection("experiences")
    .doc(venueId)
    .collection("reactions");

export type reactToExperienceOptions = {
  reactionsRef: CollectionReference<DocumentData>;
  userRef: DocumentReference<DocumentData>;
  venueRef: DocumentReference<DocumentData>;
  stats: SimStats;
  log: LogFunction;
};

export const reactToExperience: (
  options: reactToExperienceOptions
) => Promise<void> = async ({
  reactionsRef,
  userRef,
  venueRef,
  log,
  stats,
}) => {
  const snap = await userRef.get();
  assert.ok(
    snap.exists,
    chalk`addBotReaction(): user is required and has to be a bot ({magenta snap.exists}: {blueBright ${snap.exists})}`
  );

  const user = await snap.data();
  assert.ok(
    user?.bot === true,
    chalk`addBotReaction(): user is required and has to be a bot ({magenta user.bot}: {blueBright ${user?.bot})}`
  );

  await enterVenue({ userRef, venueId: venueRef.id, log });

  // for consistency with bot id's and to distinguish from the natural reactions
  const userId = userRef.id;
  const reactionId = `${userId}-reaction-${new Date().getTime()}`;
  const reaction = generateRandomReaction();
  const isText = reaction === "messageToTheBand";

  const data: Record<string, unknown> = {
    bot: true,

    created_at: new Date().getTime(),
    created_by: userId,

    reaction,
  };

  if (isText) {
    data.text = generateRandomText();
  }

  await reactionsRef.doc(reactionId).set(data);
  log(
    chalk`User {green ${userId}} reacted with {green ${
      isText ? data.text : data.reaction
    }}.`
  );
  stats.reactions = (stats.reactions ?? 0) + 1;
};

export type RemoveBotReactionsOptions = {
  reactionsRef: CollectionReference<DocumentData>;
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
};

export const removeBotReactions: (
  options: RemoveBotReactionsOptions
) => Promise<void> = async ({ reactionsRef, conf, log, stats }) => {
  const remove = withErrorReporter(
    conf.log,
    (reactionRef: DocumentReference) => {
      const promise = reactionRef.delete();
      promise.then(() => {
        log(
          chalk`{green.inverse DONE} Removed reaction with id {green ${reactionRef.id}}.`
        );
        stats.reactionsRemoved = (stats.reactionsRemoved ?? 0) + 1;
      });
      return promise;
    }
  );

  const snaps: QueryDocumentSnapshot<DocumentData>[] = (
    await reactionsRef.where("bot", "==", true).get()
  ).docs;
  for (const snap of snaps) {
    const reactionId = snap.id;

    if (!snap.exists) {
      log(
        chalk`{yellow.inverse WARN} No reaction with id {green ${reactionId}} exists that can be removed.`
      );
      continue;
    }

    const reaction = await snap.data();
    if (reaction?.bot !== true) {
      log(
        chalk`{yellow.inverse WARN} Reaction with id {green ${reactionId}} isn't marked as bot. Not removing.`
      );
      continue;
    }

    log(chalk`Removing reaction with id {green ${reactionId}}...`);
    await remove(snap.ref);
  }
};
