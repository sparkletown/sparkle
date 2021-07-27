#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";
import * as faker from "faker";
import * as admin from "firebase-admin";
import { run, SimStats, SimConfig, sleep } from "./lib/simulator";

import {
  ensureBotUsers as actualEnsureUsers,
  findVenue,
  takeSeat as actualTakeSeat,
  reactToExperience as actualReactToExperience,
  findExperienceReactions,
} from "./lib/bot";
import { LogFunction, withErrorReporter } from "./lib/log";

// imported type definitions to decrease declaration verbosity
import CollectionReference = admin.firestore.CollectionReference;
import DocumentData = admin.firestore.DocumentData;
import DocumentReference = admin.firestore.DocumentReference;

export const DEFAULT_SEAT_AFFINITY = 0.01;
// export const DEFAULT_CHAT_AFFINITY = 0.005;
export const DEFAULT_EXPERIENCE_AFFINITY = 0.005;
export const DEFAULT_CHUNK_SIZE = 100;
export const DEFAULT_TICK_MS = 1000;
export const SEATING_DEFAULTS = { minRow: 0, maxRow: 9, minCol: 0, maxCol: 9 };

export type SimulateMoveOptions = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  log: LogFunction;
  conf: SimConfig;
  stats: SimStats;
};

const simulateMove: (options: SimulateMoveOptions) => Promise<void> = async ({
  userRefs,
  venueRef,
  conf,
  stats,
  log,
}) => {
  const chunkSize =
    conf.seat?.chunkSize ?? conf.chunkSize ?? DEFAULT_CHUNK_SIZE;
  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`simulateMove(): {magenta chunkCount} must be integer {yellow > 0}`
  );

  const takeSeat = withErrorReporter(conf.log, actualTakeSeat);

  const loop = async () => {
    const tick = conf.seat?.tick ?? conf.tick ?? DEFAULT_TICK_MS;

    for (let i = 0, j = userRefs.length; i < j; i += chunkSize) {
      await Promise.all(
        userRefs.slice(i, i + chunkSize).map(async (userRef) => {
          // Determine how likely is for the user to want to move
          const affinity =
            conf.seat?.affinity ?? conf.affinity ?? DEFAULT_SEAT_AFFINITY;
          assert.ok(
            0 <= affinity && affinity <= 1,
            chalk`Seating affinity must be a number {yellow from 0 to 1}`
          );

          if (Math.random() >= affinity) {
            return;
          }

          const venue = { ...SEATING_DEFAULTS, ...conf.venue };
          const row = faker.datatype.number({
            min: venue?.minRow,
            max: venue?.maxRow,
          });
          const col = faker.datatype.number({
            min: venue?.minCol,
            max: venue?.maxCol,
          });
          // TODO: add logic checking for already taken seats

          return takeSeat({ userRef, venueRef, stats, log, row, col });
        })
      );
      // explicit sleep between the chunks
      await sleep(tick);
    }
    // implicit sleep between the loops
    setTimeout(loop, tick);
  };

  // start looping the move updates
  await loop();
};

export type SimulateChatOptions = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  reactionsRef: CollectionReference<DocumentData>;
  log: LogFunction;
  conf: SimConfig;
  stats: SimStats;
};

const simulateExperience: (
  options: SimulateChatOptions
) => Promise<void> = async ({
  conf,
  reactionsRef,
  userRefs,
  venueRef,
  stats,
  log,
}) => {
  const chunkSize =
    conf.experience?.chunkSize ?? conf.chunkSize ?? DEFAULT_CHUNK_SIZE;
  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`simulateMove(): {magenta chunkCount} must be integer {yellow > 0}`
  );

  const reactToExperience = withErrorReporter(
    conf.log,
    actualReactToExperience
  );

  const loop = async () => {
    const tick = conf.experience?.tick ?? conf.tick ?? DEFAULT_TICK_MS;

    for (let i = 0, j = userRefs.length; i < j; i += chunkSize) {
      await Promise.all(
        userRefs.slice(i, i + chunkSize).map(async (userRef) => {
          // Determine how likely is for the user to want to react
          const affinity =
            conf.experience?.affinity ??
            conf.affinity ??
            DEFAULT_EXPERIENCE_AFFINITY;
          assert.ok(
            0 <= affinity && affinity <= 1,
            chalk`Chatting affinity must be a number {yellow from 0 to 1}`
          );

          if (Math.random() >= affinity) {
            return;
          }

          return reactToExperience({
            userRef,
            venueRef,
            reactionsRef,
            stats,
            log,
          });
        })
      );
      // explicit sleep between the chunks
      await sleep(tick);
    }

    // implicit sleep between the loops
    setTimeout(loop, tick);
  };

  // start looping the chat updates
  await loop();
};

export type MainOptions = {
  stats: SimStats;
  conf: SimConfig;
  log: LogFunction;
};

export type MainResult = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  reactionsRef: CollectionReference<DocumentData>;
};

// noinspection JSIgnoredPromiseFromCall
run(
  async ({ conf, stats, log }: MainOptions): Promise<MainResult> => {
    const { venue } = conf;
    const venueId = venue?.id;

    assert.ok(venueId, chalk`main(): {magenta venue.id} is required`);
    const venueRef = await findVenue({ log, venueId: venueId });
    assert.ok(
      venueRef,
      chalk`main(): venue was not found for {magenta venue.id}: {green ${venueId}}`
    );

    const reactionsRef = await findExperienceReactions({ venueId });

    const ensureUsers = withErrorReporter(
      { ...conf.log, critical: true },
      actualEnsureUsers
    );
    const userRefs = await ensureUsers({ log, stats, ...conf.user });

    stats.usersCount = userRefs.length;

    // await Promise.all([
    await simulateMove({ userRefs, venueRef, ...venue, stats, conf, log });
    await simulateExperience({
      userRefs,
      venueRef,
      reactionsRef,
      stats,
      conf,
      log,
    });
    // ]);

    return { venueRef, userRefs, reactionsRef };
  }
);
