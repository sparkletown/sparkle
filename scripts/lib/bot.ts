import { strict as assert } from "assert";

import * as faker from "faker";
import chalk from "chalk";
import admin from "firebase-admin";

import { FieldValue } from "./helpers";
import { LogFunction, withErrorReporter } from "./log";
import { checkTypeUser } from "./guards";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  SimConfig,
  SimStats,
} from "./types";
import {
  generateRandomText,
  generateRandomReaction,
  generateUserId,
} from "./utils";

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

  log(
    chalk`{inverse NOTE} User {green ${userId}} entering venue {green ${venueId}}...`
  );

  await userRef.update({ enteredVenueIds: FieldValue.arrayUnion(venueId) });

  log(
    chalk`{green.inverse DONE} User {green ${userId}} entered  venue {green ${venueId}}.`
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
    chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col)}: ({yellow ${row}},{yellow ${col}})`
  );
};

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
    chalk`{inverse NOTE} Ensuring there are {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}}`
  );

  const candidates = Array.from({ length: count }, (_, i) => ({
    id: generateUserId({ scriptTag, index: i }),
    partyName: faker.name.findName(),
    pictureUrl: faker.internet.avatar(),
    bot: true,
    botUserScriptTag: scriptTag,
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
      log(chalk`{greenBright.inverse DONE} User {green ${id}} created.`);
      continue;
    }

    const user = userSnap.data();
    if (checkTypeUser(user)) {
      log(chalk`Found valid user {green ${id}}.`);
      resultUserRefs.push(userRef);
      continue;
    }

    log(chalk`Found invalid user {green ${id}}, updating...`);

    await userRef.update(candidate);
    resultUserRefs.push(userRef);

    stats.usersUpdated = (stats.usersUpdated ?? 0) + 1;
    log(chalk`{greenBright.inverse DONE} User {green ${id}} updated.`);
  }

  stats.usersCount = count;
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
        chalk`{green.inverse DONE} Removed  user with id {green ${userRef.id}}.`
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

    log(chalk`{inverse NOTE} Removing user with id {green ${userId}}...`);
    await remove(userRef);
  }
};

export type ReactToExperienceOptions = {
  reactionsRef: CollectionReference<DocumentData>;
  userRef: DocumentReference<DocumentData>;
  venueRef: DocumentReference<DocumentData>;
  conf: SimConfig;
  stats: SimStats;
  log: LogFunction;
};

export const reactToExperience: (
  options: ReactToExperienceOptions
) => Promise<void> = async ({
  reactionsRef,
  userRef,
  venueRef,
  conf,
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
    botUserScriptTag: conf.user?.scriptTag ?? "",

    created_at: new Date().getTime(),
    created_by: userId,

    reaction,
  };

  if (isText) {
    data.text = generateRandomText();
  }

  await reactionsRef.doc(reactionId).set(data);
  log(
    chalk`{inverse NOTE} User {green ${userId}} reacted with {green ${
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
          chalk`{green.inverse DONE} Removed  reaction with id {green ${reactionRef.id}}.`
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

    log(
      chalk`{inverse NOTE} Removing reaction with id {green ${reactionId}}...`
    );
    await remove(snap.ref);
  }
};

export type SendBotVenueMessageOptions = {
  chatsRef: CollectionReference<DocumentData>;
  userRef: DocumentReference<DocumentData>;
  venueRef: DocumentReference<DocumentData>;
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
};

export const sendBotVenueMessage: (
  options: SendBotVenueMessageOptions
) => Promise<void> = async ({
  chatsRef,
  userRef,
  venueRef,
  conf,
  log,
  stats,
}) => {
  const snap = await userRef.get();
  assert.ok(
    snap.exists,
    chalk`sendBotVenueMessage(): user is required and has to be a bot ({magenta snap.exists}: {blueBright ${snap.exists})}`
  );

  const user = await snap.data();
  assert.ok(
    user?.bot === true,
    chalk`sendBotVenueMessage(): user is required and has to be a bot ({magenta user.bot}: {blueBright ${user?.bot})}`
  );

  await enterVenue({ userRef, venueId: venueRef.id, log });

  // for consistency with bot id's and to distinguish from the natural reactions
  const userId = userRef.id;
  const chatId = `${userId}-chat-${new Date().getTime()}`;
  const text = generateRandomText();

  await chatsRef.doc(chatId).set({
    bot: true,
    botUserScriptTag: conf.user?.scriptTag ?? "",

    from: userId,
    text,
    ts_utc: admin.firestore.Timestamp.now(),
  });

  log(chalk`{inverse NOTE} User {green ${userId}} sent text {green ${text}}.`);
  stats.chatlines = (stats.chatlines ?? 0) + 1;
};

export type RemoveBotChatMessagesOptions = {
  chatsRef: CollectionReference<DocumentData>;
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
};

export const removeBotChatMessages: (
  options: RemoveBotChatMessagesOptions
) => Promise<void> = async ({ chatsRef, conf, log, stats }) => {
  const remove = withErrorReporter(conf.log, (chatRef: DocumentReference) => {
    const promise = chatRef.delete();
    promise.then(() => {
      log(
        chalk`{green.inverse DONE} Removed  chat with id {green ${chatRef.id}}.`
      );
      stats.chatlinesRemoved = (stats.chatlinesRemoved ?? 0) + 1;
    });
    return promise;
  });

  const snaps: QueryDocumentSnapshot<DocumentData>[] = (
    await chatsRef.where("bot", "==", true).get()
  ).docs;
  for (const snap of snaps) {
    const chatId = snap.id;

    if (!snap.exists) {
      log(
        chalk`{yellow.inverse WARN} No chat with id {green ${chatId}} exists that can be removed.`
      );
      continue;
    }

    const chat = await snap.data();
    if (chat?.bot !== true) {
      log(
        chalk`{yellow.inverse WARN} Chat with id {green ${chatId}} isn't marked as bot. Not removing.`
      );
      continue;
    }

    log(chalk`{inverse NOTE} Removing chat with id {green ${chatId}}...`);
    await remove(snap.ref);
  }
};
