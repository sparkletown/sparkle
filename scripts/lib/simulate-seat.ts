import { strict as assert } from "assert";

import chalk from "chalk";
import faker from "faker";

import { takeSeat as actualTakeSeat } from "./bot";
import { withErrorReporter, LogFunction } from "./log";
import { DocumentData, DocumentReference, SimConfig, SimStats } from "./types";
import { sleep } from "./utils";

export const DEFAULT_SEAT_CHUNK_SIZE = 100;
export const DEFAULT_SEAT_TICK_MS = 1000;
export const DEFAULT_SEAT_AFFINITY = 0.01;

export const GRID_DEFAULTS = { minRow: 0, maxRow: 9, minCol: 0, maxCol: 9 };

export type simulateSeatOptions = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
  stop: Promise<void>;
};
export const simulateSeat: (
  options: simulateSeatOptions
) => Promise<void> = async (options) => {
  const { userRefs, conf, stop } = options;

  const chunkSize =
    conf.seat?.chunkSize ?? conf.chunkSize ?? DEFAULT_SEAT_CHUNK_SIZE;

  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`simulateMove(): {magenta chunkCount} must be integer {yellow > 0}`
  );

  const takeSeat = withErrorReporter(conf.log, actualTakeSeat);

  // flag that will not let loop going on when user pressed CTRL+C
  let isStopped = false;
  stop.then(() => (isStopped = true));

  const loop = async () => {
    const tick = conf.seat?.tick ?? conf.tick ?? DEFAULT_SEAT_TICK_MS;

    for (let i = 0, j = userRefs.length; !isStopped && i < j; i += chunkSize) {
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

          const venue = { ...GRID_DEFAULTS, ...conf.venue };
          const row = faker.datatype.number({
            min: venue?.minRow,
            max: venue?.maxRow,
          });
          const col = faker.datatype.number({
            min: venue?.minCol,
            max: venue?.maxCol,
          });

          // TODO: add logic checking for already taken seats

          return takeSeat({ ...options, userRef, row, col });
        })
      );
      // explicit sleep between the chunks
      !isStopped && (await sleep(tick));
    }
    // implicit sleep between the loops
    !isStopped && setTimeout(loop, tick);
  };

  // start looping the move updates
  await loop();
};
