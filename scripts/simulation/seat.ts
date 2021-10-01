import { strict as assert } from "assert";

import chalk from "chalk";

import { takeSeatInAudience as actualTakeSeat } from "../lib/bot";
import { getSectionsRef } from "../lib/collections";
import { getAuditoriumGridSize } from "../lib/documents";
import { withErrorReporter } from "../lib/log";
import {
  DocumentReference,
  GridPosition,
  GridSize,
  SimContext,
} from "../lib/types";
import { determineWhereToSeat, pickValueFrom, sleep } from "../lib/utils";

export const DEFAULT_SEAT_CHUNK_SIZE = 100;
export const DEFAULT_SEAT_TICK_MS = 1000;
export const DEFAULT_SEAT_AFFINITY = 0.01;
export const DEFAULT_SEAT_IMPATIENCE = 0.01;

// These must both be odd, otherwise the video won't be centered properly
export const SECTION_DEFAULT_ROWS_COUNT = 17;
export const SECTION_DEFAULT_COLUMNS_COUNT = 23;

export const DEFAULT_GRID_SIZE: GridSize = {
  auditoriumRows: SECTION_DEFAULT_ROWS_COUNT,
  auditoriumColumns: SECTION_DEFAULT_COLUMNS_COUNT,
};

export const simSeat: (options: SimContext) => Promise<void> = async (
  options
) => {
  const { userRefs, usersById, conf, stop } = options;

  const impatience = conf.seat?.impatience ?? DEFAULT_SEAT_IMPATIENCE;
  const affinity =
    conf.seat?.affinity ?? conf.affinity ?? DEFAULT_SEAT_AFFINITY;
  const tick = conf.seat?.tick ?? conf.tick ?? DEFAULT_SEAT_TICK_MS;
  const chunkSize =
    conf.seat?.chunkSize ?? conf.chunkSize ?? DEFAULT_SEAT_CHUNK_SIZE;

  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`${simSeat.name}(): {magenta chunkCount} must be integer {yellow > 0}`
  );
  assert.ok(
    Number.isFinite(tick) && tick >= 10,
    chalk`${simSeat.name}(): {magenta tick} must be integer {yellow >= 10}`
  );
  assert.ok(
    0 <= affinity && affinity <= 1,
    chalk`${simSeat.name}(): {magenta affinity} must be a number {yellow from 0 to 1}`
  );

  // Manual config should take precedence if the col/row values are provided
  const grid: GridSize = {
    ...DEFAULT_GRID_SIZE,
    ...(await getAuditoriumGridSize(options)),
    ...conf.venue,
  };

  const sectionRefs: DocumentReference[] = await (
    await getSectionsRef(options)
  ).listDocuments();

  // keep track of who's already seated
  const seatedUsers: Record<string, GridPosition | undefined> = {};
  const seatedPositions: Record<string, true | undefined> = {};

  const takeSeat = withErrorReporter(conf.log, actualTakeSeat);

  // flag that will not let loop going on when user pressed CTRL+C
  let isStopped = false;
  stop.then(() => (isStopped = true));

  const loop = async () => {
    for (let i = 0, j = userRefs.length; !isStopped && i < j; i += chunkSize) {
      await Promise.all(
        userRefs.slice(i, i + chunkSize).map(async (userRef) => {
          const userId = userRef.id;

          // affinity works only for those already seated
          if (seatedUsers[userId] && Math.random() >= affinity) {
            return;
          }

          // more impatient users will sit down fast, then affinity to move will kick in
          if (!seatedUsers[userId] && Math.random() >= impatience) {
            return;
          }

          const sectionId = pickValueFrom(sectionRefs)?.id;

          const pos = determineWhereToSeat(
            userId,
            grid,
            seatedUsers,
            seatedPositions
          );

          await takeSeat({
            ...options,
            userRef,
            user: usersById[userRef.id],
            ...pos,
            sectionId,
          });
        })
      );
      // explicit sleep between the chunks
      !isStopped && (await sleep(tick));
    }
    // implicit sleep between the loops
    !isStopped && setTimeout(loop, tick);
  };

  // start looping the move updates
  return loop();
};
