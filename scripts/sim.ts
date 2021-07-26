#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";
import * as faker from "faker";
import * as admin from "firebase-admin";
import {
  run,
  SimStats,
  readConfig,
  SimConfig,
  sleep,
  init,
} from "./lib/simulator";

import {
  ensureUsers as actualEnsureUsers,
  findVenue,
  takeSeat as actualTakeSeat,
} from "./lib/bot";
import {
  displayHelp,
  log as actualLog,
  LogFunction,
  withErrorReporter,
} from "./lib/log";

// imported type definitions to decrease declaration verbosity
import DocumentData = admin.firestore.DocumentData;
import DocumentReference = admin.firestore.DocumentReference;

export const SIM_DIR = "./simulator/";
export const SIM_EXT = ".config.json";
export const DEFAULT_SEAT_AFFINITY = 0.5;
export const DEFAULT_CHUNK_SIZE = 100;
export const DEFAULT_TICK_MS = 100;
export const SEATING_DEFAULTS = { minRow: 0, maxRow: 9, minCol: 0, maxCol: 9 };

export type SimulateMoveOptions = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  chunkSize?: number;
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
  const chunkSize = conf.chunkSize ?? DEFAULT_CHUNK_SIZE;
  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`simulateMove(): {magenta chunkCount} must be integer {yellow > 0}`
  );

  const takeSeat = withErrorReporter(
    { verbose: true, critical: false },
    actualTakeSeat
  );

  const loop = async () => {
    const tick = conf.seat?.tick ?? conf.tick ?? DEFAULT_TICK_MS;

    for (let i = 0, j = userRefs.length; i < j; i += chunkSize) {
      await Promise.all(
        userRefs.slice(i, i + chunkSize).map(async (userRef) => {
          // Determine how likely is for the user to want to move
          const affinity = conf.seat?.affinity ?? DEFAULT_SEAT_AFFINITY;
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
};

const simulateChat: (
  options: SimulateChatOptions
) => Promise<void> = async () => {
  console.log("CHAT CHAT CHAT");
};

const main: () => Promise<SimStats> = async () => {
  const startTime = new Date();
  const configurationName = process.argv[2];

  if (!configurationName) {
    displayHelp({ dir: SIM_DIR, ext: SIM_EXT });
    process.exit(0);
    // Rather return empty object than add undefined to the return type
    return {};
  }

  const { conf, configurationFilename } = readConfig({
    name: configurationName,
    dir: SIM_DIR,
    ext: SIM_EXT,
  });
  const { verbose = false, venue } = conf;
  const stats: SimStats = { configurationFilename };

  const log = verbose ? actualLog : () => undefined;

  init({ log, conf, stats });

  assert.ok(venue?.id, chalk`main(): {magenta venue.id} is required`);
  const venueRef = await findVenue({ log, venueId: venue?.id });
  assert.ok(
    venueRef,
    chalk`main(): venue was not found for {magenta venue.id}: {green ${venue?.id}}`
  );

  const ensureUsers = withErrorReporter({ verbose }, actualEnsureUsers);
  const userRefs = await ensureUsers({ log, stats, ...conf.user });

  stats.usersCount = userRefs.length;

  // Nice to print this before the spam of updates starts
  log(chalk`Press {redBright CTRL-C} to exit...`);

  await Promise.all([
    simulateMove({ userRefs, venueRef, ...venue, stats, conf, log }),
    simulateChat({ userRefs, venueRef, ...venue }),
  ]);

  stats.startTime = startTime.toISOString();
  return stats;
};

run(main).then(() => "All done.");
