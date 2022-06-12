import { strict as assert } from "assert";

import chalk from "chalk";
import * as faker from "faker";
import admin from "firebase-admin";
import { chunk, keyBy, random } from "lodash";

import { getUsersRef } from "./collections";
import {
  getRecentSeatedUsersUserRef,
  getSeatedSectionUserRef,
  getSeatedTableUserRef,
  getVenueName,
} from "./documents";
import { FetchSovereignVenueReturn } from "./fetch";
import { FieldValue, wrapIntoSlashes } from "./helpers";
import { withErrorReporter } from "./log";
import {
  BotUser,
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  SectionGridPosition,
  SimContext,
  SimStats,
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

const enterVenue: (
  options: {
    userRef: DocumentReference;
  } & SimContext<"venueRef" | "venueId" | "stats" | "log" | "sovereignVenue">
) => Promise<void | undefined> = async ({
  userRef,
  venueRef,
  venueId: passedVenueId,
  sovereignVenue,
  log,
  stats,
}) => {
  const userId = userRef.id;
  const user = (await userRef.get()).data();

  if (!user) {
    return log(
      chalk`{yellow.inverse WARN} No user with id {green ${userId}} that can enter venue {green ${passedVenueId}}.`
    );
  }

  const venueId = passedVenueId ?? venueRef?.id;
  assert.ok(
    venueId,
    `${enterVenue.name}(): One of {magenta venueId} and {magenta venueRef} is required.`
  );

  if (user.enteredVenueIds?.includes(venueId)) {
    return; // already in venue
  }

  log(
    chalk`{inverse NOTE} User {green ${userId}} entering venue {green ${venueId}}...`
  );

  await userRef.update({
    enteredVenueIds: FieldValue.arrayUnion(
      ...[venueId, sovereignVenue.sovereignVenue.id]
    ),
  });
  stats.entered = increment(stats.entered);
  stats.writes = increment(stats.writes);

  log(
    chalk`{green.inverse DONE} User {green ${userId}} entered  venue {green ${venueId}}.`
  );
};

export const takeSeatInAudience: (
  options: {
    userRef: DocumentReference;
    user: BotUser;
    pos: SectionGridPosition;
  } & SimContext<"venueRef" | "stats" | "log" | "sovereignVenue">
) => Promise<void> = async (options) => {
  const { userRef, user, venueRef, stats, log, pos, sovereignVenue } = options;
  const { sectionId, row, col } = pos;

  const venueId = venueRef.id;
  const venueName = await getVenueName(options);

  if (!venueName) {
    throw new Error(
      `Venue name was not found for {magenta venueId}: {green ${venueId}}.`
    );
  }

  await enterVenue({ ...options, venueId });

  const locationPromise = updateUserLocation(userRef, sovereignVenue, stats);

  const seatPromise = (sectionId
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
  ).then(() => (stats.writes = increment(stats.writes)));

  const recentSeatPromise = updateRecentSeat(venueId, userRef, "auditorium", {
    sectionId,
  });

  await Promise.all([locationPromise, seatPromise, recentSeatPromise]);

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

  await enterVenue(options);

  const vid = `${venueName}-table${idx}`;

  const locationPromise = updateUserLocation(userRef, sovereignVenue, stats);

  const seatPromise = getSeatedTableUserRef({ venueId, userId: userRef.id })
    .then((ref) =>
      ref.set({
        ...user,
        path: {
          venueId,
          tableReference,
        },
      })
    )
    .then(() => (stats.writes = increment(stats.writes)));

  const recentSeatPromise = updateRecentSeat(venueId, userRef, "jazzbar", {});

  await Promise.all([locationPromise, seatPromise, recentSeatPromise]);

  stats.relocations = increment(stats.relocations);

  log(
    chalk`{inverse NOTE} User {green ${userRef.id}} took seat at {dim (row,col,ref,vid)}: ({yellow ${row}},{yellow ${col}},{green ${tableReference}},{green ${vid}})`
  );
};

const updateUserLocation = (
  userRef: DocumentReference,
  sovereignVenue: FetchSovereignVenueReturn,
  stats: SimStats
) => {
  const allVenueIds = [
    ...sovereignVenue.checkedVenueIds,
    sovereignVenue.sovereignVenue.id,
  ].reverse();

  const locationPath = wrapIntoSlashes(allVenueIds.join("/"));

  return userRef
    .update({ lastSeenAt: Date.now(), lastVenueIdSeenIn: locationPath })
    .then(() => (stats.writes = increment(stats.writes)));
};

const updateRecentSeat = (
  venueId: string,
  userRef: DocumentReference,
  template: string,
  venueSpecificData: unknown
) =>
  getRecentSeatedUsersUserRef({
    venueId,
    userId: userRef.id,
  }).then((ref) =>
    ref.set({
      template,
      venueId,
      venueSpecificData,
      lastSittingTimeMs: Date.now(),
    })
  );

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
      pictureUrl: "https://i.pravatar.cc/300",
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

  chunk(candidates, 250).map(async (candidatesChunk) => {
    const batch = admin.firestore().batch();

    for (const candidate of candidatesChunk) {
      if (isStopped) {
        break;
      }
      const id = candidate.id;
      const userRef = await usersRef.doc(id);

      batch.set(userRef, candidate);
      resultUserRefs.push(userRef);

      stats.writes = increment(stats.writes);
      (stats.users ??= {}).updated = increment(stats.users.updated);
      log(chalk`{greenBright.inverse DONE} User {green ${id}} updated.`);

      // just so that busy loop doesn't mess with other async stuff, like the stop signal
      // unless the stop signal isn't being maintained i.e. keepAlive is false
    }
    await batch.commit();
    await sleep(10);
  });

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
  chunk(userRefs, 250).map(async (userRefsChunk) => {
    const batch = admin.firestore().batch();

    for (const userRef of userRefsChunk) {
      batch.delete(userRef);
      log(
        chalk`{green.inverse DONE} Removed  user with id {green ${userRef.id}}.`
      );
      (stats.users ??= {}).removed = increment(stats.users.removed);
    }

    await batch.commit();
  });
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
    created_by: {
      anonMode: false,
      id: userId,
      partyName: user.partyName,
      pictureUrl: user.pictureUrl,
    },

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

  const batch = admin.firestore().batch();

  batch.set(chatsRef.doc(chatId), {
    bot: true,
    botUserScriptTag: conf.user?.scriptTag ?? "",

    fromUser: {
      id: userId,
      partyName: user.partyName,
      pictureUrl: user.pictureUrl,
    },
    isQuestion: false,
    text,
    timestamp: admin.firestore.Timestamp.now(),
  });

  const randomShard = venueRef
    .collection("chatMessagesCounter")
    .doc(random(10 - 1).toString());

  batch.update(randomShard, "count", admin.firestore.FieldValue.increment(1));

  await batch.commit();

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
