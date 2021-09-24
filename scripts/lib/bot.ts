import { strict as assert } from "assert";

import chalk from "chalk";
import * as faker from "faker";
import admin from "firebase-admin";
import { keyBy } from "lodash";

import { getUsersRef } from "./collections";
import {
  getSeatedSectionUserRef,
  getSeatedTableUserRef,
  getVenueName,
} from "./documents";
import { checkTypeUser } from "./guards";
import { FieldValue, wrapIntoSlashes } from "./helpers";
import { withErrorReporter } from "./log";
import {
  BotUser,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  SimContext,
  TableInfo,
  WithId,
} from "./types";
import {
  generateRandomReaction,
  generateRandomText,
  generateUserId,
  increment,
  sleep,
} from "./utils";

export const enterVenue: (
  options: {
    userRef: DocumentReference;
  } & SimContext<"venueRef" | "venueId" | "stats" | "log" | "sovereignVenue">
) => Promise<void | undefined> = async ({
  userRef,
  venueRef,
  venueId,
  sovereignVenue,
  log,
  stats,
}) => {
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

  await userRef.update({
    enteredVenueIds: FieldValue.arrayUnion(
      ...[candidateId, sovereignVenue.sovereignVenue.id]
    ),
  });
  stats.entered = increment(stats.entered);
  stats.writes = increment(stats.writes);

  log(
    chalk`{green.inverse DONE} User {green ${userId}} entered  venue {green ${candidateId}}.`
  );
};

export const takeSeatInAudience: (
  options: {
    userRef: DocumentReference;
    user: BotUser;
    row: number;
    col: number;
    sectionId?: string;
  } & SimContext<"venueRef" | "stats" | "log" | "sovereignVenue">
) => Promise<void> = async (options) => {
  const {
    userRef,
    user,
    venueRef,
    stats,
    log,
    row,
    col,
    sectionId,
    sovereignVenue,
  } = options;
  const venueId = venueRef.id;
  const venueName = await getVenueName(options);

  if (!venueName) {
    throw new Error(
      `Venue name was not found for {magenta venueId}: {green ${venueId}}.`
    );
  }

  const allVenueIds = [
    ...sovereignVenue.checkedVenueIds,
    sovereignVenue.sovereignVenue.id,
  ].reverse();

  const locationPath = wrapIntoSlashes(allVenueIds.join("/"));

  await enterVenue({ ...options, venueId });

  const now = Date.now();

  await Promise.all([
    userRef
      .update({ lastSeenAt: now, lastVenueIdSeenIn: locationPath })
      .then(() => (stats.writes = increment(stats.writes))),
    (sectionId
      ? getSeatedSectionUserRef({
          venueId,
          sectionId,
          userId: userRef.id,
        }).then((ref) =>
          ref.set({
            ...user,
            position: {
              row: row,
              column: col,
            },
            path: {
              venueId,
              sectionId,
            },
          })
        )
      : Promise.resolve()
    ).then(() => (stats.writes = increment(stats.writes))),
  ]);

  stats.relocations = increment(stats.relocations);

  if (sectionId) {
    log(
      chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col,sec)}: ({yellow ${row}},{yellow ${col}},{green ${sectionId}})`
    );
  } else {
    log(
      chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col)}: ({yellow ${row}},{yellow ${col}})`
    );
  }
};

export const takeSeatAtTable: (
  options: {
    userRef: DocumentReference;
    user: BotUser;
  } & TableInfo &
    SimContext<
      "venueRef" | "venueId" | "venueName" | "stats" | "log" | "sovereignVenue"
    >
) => Promise<void> = async (options) => {
  await enterVenue(options);

  const {
    userRef,
    user,
    venueId,
    venueName,
    stats,
    log,
    row,
    col,
    ref: tableReference,
    idx,
    sovereignVenue,
  } = options;

  const now = Date.now();

  const vid = `${venueName}-table${idx}`;

  const allVenueIds = [
    ...sovereignVenue.checkedVenueIds,
    sovereignVenue.sovereignVenue.id,
  ].reverse();

  const locationPath = wrapIntoSlashes(allVenueIds.join("/"));

  await Promise.all([
    userRef
      .update({ lastSeenAt: now, lastVenueIdSeenIn: locationPath })
      .then(() => (stats.writes = increment(stats.writes))),
    getSeatedTableUserRef({ venueId, userId: userRef.id })
      .then((ref) =>
        ref.set({
          ...user,
          path: {
            venueId,
            tableReference,
          },
        })
      )
      .then(() => (stats.writes = increment(stats.writes))),
  ]);

  stats.relocations = increment(stats.relocations);

  log(
    chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col,ref,vid)}: ({yellow ${row}},{yellow ${col}},{green ${tableReference}},{green ${vid}})`
  );
};

export const ensureBotUsers: (
  options: SimContext<"conf" | "log" | "stats" | "stop">
) => Promise<Pick<SimContext, "userRefs" | "usersById">> = async ({
  conf,
  log,
  stats,
  stop,
}) => {
  const { scriptTag, count } = conf.user ?? {};
  assert.ok(
    scriptTag,
    chalk`${ensureBotUsers.name}(): {magenta scriptTag} is required`
  );
  assert.ok(
    count && count > 0,
    chalk`${ensureBotUsers.name}(): {magenta count} is required and must be {yellow > 0}`
  );

  const usersRef = await getUsersRef();

  log(
    chalk`{inverse NOTE} Ensuring references to {yellow ${count}} users with {magenta scriptTag} {green ${scriptTag}}`
  );

  const candidates: WithId<BotUser>[] = Array.from(
    { length: count },
    (_, i) => ({
      id: generateUserId({ scriptTag, index: i }),
      partyName: faker.name.findName(),
      pictureUrl: faker.internet.avatar(),
      bot: true,
      botUserScriptTag: scriptTag,
    })
  );

  // flag that will not let loop going on when user pressed CTRL+C
  let isStopped = false;
  // in case script isn't being kept alive, don't stop creating users
  stop.then(
    (signal) => (isStopped = signal === "sigint" || conf.keepAlive !== false)
  );

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

        stats.writes = increment(stats.writes);
        (stats.users ??= {}).created = increment(stats.users.created);
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

    stats.writes = increment(stats.writes);
    (stats.users ??= {}).updated = increment(stats.users.updated);
    log(chalk`{greenBright.inverse DONE} User {green ${id}} updated.`);

    // just so that busy loop doesn't mess with other async stuff, like the stop signal
    // unless the stop signal isn't being maintained i.e. keepAlive is false
    await sleep(10);
  }

  (stats.users ??= {}).count = resultUserRefs.length;
  log(
    chalk`{greenBright.inverse DONE} Ensured  references to {yellow ${resultUserRefs.length}} users with {magenta scriptTag} {green ${scriptTag}}.`
  );

  return {
    userRefs: resultUserRefs,
    usersById: keyBy(candidates, "id"),
  };
};

export const removeBotUsers: (
  options: SimContext<"userRefs" | "conf" | "log" | "stats">
) => Promise<void> = async ({ userRefs, conf, log, stats }) => {
  const remove = withErrorReporter(conf.log, (userRef: DocumentReference) => {
    const promise = userRef.delete();
    promise.then(() => {
      log(
        chalk`{green.inverse DONE} Removed  user with id {green ${userRef.id}}.`
      );
      (stats.users ??= {}).removed = increment(stats.users.removed);
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

export const addBotReaction: (
  options: {
    reactionsRef: CollectionReference;
    userRef: DocumentReference;
  } & SimContext<
    "venueRef" | "venueId" | "conf" | "stats" | "log" | "sovereignVenue"
  >
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
  stats.writes = increment(stats.writes);
  (stats.reactions ??= {}).created = increment(stats.reactions.created);
};

export const removeBotReactions: (
  options: SimContext<"reactionsRef" | "conf" | "log" | "stats">
) => Promise<void> = async ({ reactionsRef, conf, log, stats }) => {
  const remove = withErrorReporter(
    conf.log,
    (reactionRef: DocumentReference) => {
      const promise = reactionRef.delete();
      promise.then(() => {
        log(
          chalk`{green.inverse DONE} Removed  reaction with id {green ${reactionRef.id}}.`
        );
        (stats.reactions ??= {}).removed = increment(stats.reactions.removed);
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

export const sendBotVenueMessage: (
  options: {
    userRef: DocumentReference;
  } & SimContext<
    "venueRef" | "chatsRef" | "conf" | "log" | "stats" | "sovereignVenue"
  >
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

  stats.writes = increment(stats.writes);
  (stats.chatlines ??= {}).created = increment(stats.chatlines.created);
  log(
    chalk`{inverse NOTE} User {green ${userId}} sent chat ln {green ${text}}.`
  );
};

export const removeBotChatMessages: (
  options: SimContext<"chatsRef" | "conf" | "log" | "stats">
) => Promise<void> = async ({ chatsRef, conf, log, stats }) => {
  const remove = withErrorReporter(conf.log, (chatRef: DocumentReference) => {
    const promise = chatRef.delete();
    promise.then(() => {
      log(
        chalk`{green.inverse DONE} Removed  chat with id {green ${chatRef.id}}.`
      );
      (stats.chatlines ??= {}).removed = increment(stats.chatlines.removed);
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
