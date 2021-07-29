import { strict as assert } from "assert";

import * as faker from "faker";
import chalk from "chalk";
import admin from "firebase-admin";

import { getUsersRef } from "./collections";
import { getVenueName } from "./documents";
import { FieldValue } from "./helpers";
import { withErrorReporter } from "./log";
import { checkTypeUser } from "./guards";
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  SimConfig,
  SimStats,
  LogFunction,
} from "./types";
import {
  generateRandomText,
  generateRandomReaction,
  generateUserId,
  sleep,
} from "./utils";

export type EnterVenueOptions = {
  userRef: DocumentReference;
  venueRef?: DocumentReference;
  venueId?: string;
  log: LogFunction;
  stats: SimStats;
};

export const enterVenue = async ({
  userRef,
  venueRef,
  venueId,
  log,
  stats,
}: EnterVenueOptions) => {
  const userId = userRef.id;
  const user = (await userRef.get()).data();

  if (!user) {
    return log(
      chalk`{yellow.inverse WARN} No user with id {green ${userId}} that can enter venue {green ${venueId}}.`
    );
  }

  const candidateId = venueId ?? venueRef?.id;
  assert.ok(
    candidateId,
    `${enterVenue.name}(): One of {magenta venueId} and {magenta venueRef} is required.`
  );

  if (user.enteredVenueIds?.includes(candidateId)) {
    return; // already in venue
  }

  log(
    chalk`{inverse NOTE} User {green ${userId}} entering venue {green ${candidateId}}...`
  );

  await userRef.update({ enteredVenueIds: FieldValue.arrayUnion(candidateId) });
  stats.writes = (stats.writes ?? 0) + 1;

  log(
    chalk`{green.inverse DONE} User {green ${userId}} entered  venue {green ${candidateId}}.`
  );
};

export type TakeSeatOptions = {
  userRef: DocumentReference;
  venueRef: DocumentReference;
  row: number;
  col: number;
  sec?: string;
  stats: SimStats;
  log: LogFunction;
};

export const takeSeat: (options: TakeSeatOptions) => Promise<void> = async (
  options
) => {
  const { userRef, venueRef, stats, log, row, col, sec } = options;
  const venueId = venueRef.id;
  const venueName = await getVenueName(options);

  if (!venueName) {
    throw new Error(
      `Venue name was not found for {magenta venueId}: {green ${venueId}}.`
    );
  }

  await enterVenue({ ...options, venueId });

  const now = Date.now();

  await Promise.all([
    userRef
      .update({ lastSeenAt: now, lastSeenIn: { [venueName]: now } })
      .then(() => (stats.writes = (stats.writes ?? 0) + 1)),
    userRef
      .update({
        [`data.${venueId}`]: sec
          ? { row, column: col, sectionId: sec }
          : { row, column: col },
      })
      .then(() => (stats.writes = (stats.writes ?? 0) + 1)),
  ]);

  stats.relocations = (stats.relocations ?? 0) + 1;

  if (sec) {
    log(
      chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col,sec)}: ({yellow ${row}},{yellow ${col}},{green ${sec}})`
    );
  } else {
    log(
      chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col)}: ({yellow ${row}},{yellow ${col}})`
    );
  }
};

export type EnsureBotUsersOptions = {
  conf: SimConfig;
  count?: number;
  log: LogFunction;
  scriptTag?: string;
  stats: SimStats;
  stop: Promise<void>;
};

export const ensureBotUsers: (
  options: EnsureBotUsersOptions
) => Promise<DocumentReference[]> = async ({
  conf,
  count,
  log,
  scriptTag,
  stats,
  stop,
}) => {
  assert.ok(
    scriptTag,
    `${ensureBotUsers.name}(): {magenta scriptTag} is required`
  );
  assert.ok(
    count && count > 0,
    `${ensureBotUsers.name}(): {magenta count} is required and must be {yellow > 0}`
  );

  const usersRef = await getUsersRef();

  log(
    chalk`{inverse NOTE} Ensuring references to {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}}`
  );

  const candidates = Array.from({ length: count }, (_, i) => ({
    id: generateUserId({ scriptTag, index: i }),
    partyName: faker.name.findName(),
    pictureUrl: faker.internet.avatar(),
    bot: true,
    botUserScriptTag: scriptTag,
  }));

  // flag that will not let loop going on when user pressed CTRL+C
  let isStopped = false;
  stop.then(() => (isStopped = true));

  const resultUserRefs: DocumentReference[] = [];

  for (const candidate of candidates) {
    if (isStopped) {
      break;
    }
    const id = candidate.id;
    const userRef = await usersRef.doc(id);

    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      if (conf.user?.createMissing ?? true) {
        log(
          chalk`{yellow.inverse WARN} User {green ${id}} doesn't exist, creating...`
        );

        await userRef.set(candidate);
        resultUserRefs.push(userRef);

        stats.writes = (stats.writes ?? 0) + 1;
        (stats.users ??= {}).created = (stats.users.created ?? 0) + 1;
        log(chalk`{greenBright.inverse DONE} User {green ${id}} created.`);
      }
      continue;
    }

    const user = userSnap.data();
    if (checkTypeUser(user)) {
      log(chalk`{inverse NOTE} Found valid user {green ${id}}.`);
      resultUserRefs.push(userRef);
      continue;
    }

    log(
      chalk`{yellow.inverse WARN} Found invalid user {green ${id}}, updating...`
    );

    await userRef.update(candidate);
    resultUserRefs.push(userRef);

    stats.writes = (stats.writes ?? 0) + 1;
    (stats.users ??= {}).updated = (stats.users.updated ?? 0) + 1;
    log(chalk`{greenBright.inverse DONE} User {green ${id}} updated.`);

    // just so that busy loop doesn't mess with other async stuff, like the stop signal
    await sleep(10);
  }

  (stats.users ??= {}).count = resultUserRefs.length;
  log(
    chalk`{greenBright.inverse DONE} Ensured  references to {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}}.`
  );

  return resultUserRefs;
};

export type RemoveBotUsersOptions = {
  userRefs: DocumentReference[];
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
      (stats.users ??= {}).removed = (stats.users.removed ?? 0) + 1;
    });
    return promise;
  });

  for (const userRef of userRefs) {
    const userId = userRef.id;

    const snap: DocumentSnapshot = await userRef.get();
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

export type AddBotReactionOptions = {
  reactionsRef: CollectionReference;
  userRef: DocumentReference;
  venueId: string;
  conf: SimConfig;
  stats: SimStats;
  log: LogFunction;
};

export const addBotReaction: (
  options: AddBotReactionOptions
) => Promise<void> = async (options) => {
  const { reactionsRef, userRef, conf, log, stats } = options;
  const snap = await userRef.get();
  assert.ok(
    snap.exists,
    chalk`${addBotReaction.name}(): user is required and has to be a bot ({magenta snap.exists}: {blueBright ${snap.exists})}`
  );

  const user = await snap.data();
  assert.ok(
    user?.bot === true,
    chalk`${addBotReaction.name}(): user is required and has to be a bot ({magenta user.bot}: {blueBright ${user?.bot})}`
  );

  await enterVenue(options);

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
  stats.writes = (stats.writes ?? 0) + 1;
  (stats.reactions ??= {}).created = (stats.reactions.created ?? 0) + 1;
};

export type RemoveBotReactionsOptions = {
  reactionsRef: CollectionReference;
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
        (stats.reactions ??= {}).removed = (stats.reactions.removed ?? 0) + 1;
      });
      return promise;
    }
  );

  let query = reactionsRef.where("bot", "==", true);
  if (conf.user?.scriptTag) {
    query = query.where("botUserScriptTag", "==", conf.user.scriptTag);
  }

  const snaps: QueryDocumentSnapshot[] = (await query.get()).docs;
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
  chatsRef: CollectionReference;
  userRef: DocumentReference;
  venueRef: DocumentReference;
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
};

export const sendBotVenueMessage: (
  options: SendBotVenueMessageOptions
) => Promise<void> = async (options) => {
  const { chatsRef, userRef, venueRef, conf, log, stats } = options;
  const snap = await userRef.get();
  assert.ok(
    snap.exists,
    chalk`${sendBotVenueMessage.name}(): user is required and has to be a bot ({magenta snap.exists}: {blueBright ${snap.exists})}`
  );

  const user = await snap.data();
  assert.ok(
    user?.bot === true,
    chalk`${sendBotVenueMessage.name}(): user is required and has to be a bot ({magenta user.bot}: {blueBright ${user?.bot})}`
  );

  await enterVenue({ ...options, userRef, venueId: venueRef.id });

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

  stats.writes = (stats.writes ?? 0) + 1;
  (stats.chatlines ??= {}).created = (stats.chatlines.created ?? 0) + 1;
  log(
    chalk`{inverse NOTE} User {green ${userId}} sent chat ln {green ${text}}.`
  );
};

export type RemoveBotChatMessagesOptions = {
  chatsRef: CollectionReference;
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
      (stats.chatlines ??= {}).removed = (stats.chatlines.removed ?? 0) + 1;
    });
    return promise;
  });

  let query = chatsRef.where("bot", "==", true);
  if (conf.user?.scriptTag) {
    query = query.where("botUserScriptTag", "==", conf.user.scriptTag);
  }

  const snaps: QueryDocumentSnapshot[] = (await query.get()).docs;
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
