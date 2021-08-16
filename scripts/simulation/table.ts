import { strict as assert } from "assert";

import chalk from "chalk";
import faker from "faker";

import { takeSeatAtTable as actualTakeSeat } from "../lib/bot";
import { getVenueTablesInfo } from "../lib/documents";
import { withErrorReporter } from "../lib/log";
import { SimContext, TableInfo } from "../lib/types";
import { generateMultipleTablesFor, pickValueFrom, sleep } from "../lib/utils";

export const DEFAULT_TABLE_CHUNK_SIZE = 10;
export const DEFAULT_TABLE_TICK_MS = 1000;
export const DEFAULT_TABLE_AFFINITY = 0.01;
export const DEFAULT_TABLE_IMPATIENCE = 0.01;

export const DEFAULT_JAZZ_COUNT = 12;
export const DEFAULT_CONV_COUNT = 10;

export const DEFAULT_TABLE_COL = 3;
export const DEFAULT_TABLE_ROW = 2;
export const DEFAULT_TABLE_CAP = DEFAULT_TABLE_ROW * DEFAULT_TABLE_COL;

export const DEFAULT_JAZZ_TABLE_INFOS: TableInfo[] = generateMultipleTablesFor(
  DEFAULT_JAZZ_COUNT,
  { cap: DEFAULT_TABLE_CAP, col: DEFAULT_TABLE_COL, row: DEFAULT_TABLE_ROW }
);
export const DEFAULT_CONV_TABLE_INFOS: TableInfo[] = generateMultipleTablesFor(
  DEFAULT_CONV_COUNT,
  { cap: DEFAULT_TABLE_CAP, col: DEFAULT_TABLE_COL, row: DEFAULT_TABLE_ROW }
);

export const simTable: (options: SimContext) => Promise<void> = async (
  options
) => {
  const { userRefs, conf, stop, template } = options;

  const impatience = conf.table?.impatience ?? DEFAULT_TABLE_IMPATIENCE;
  const affinity =
    conf.table?.affinity ?? conf.affinity ?? DEFAULT_TABLE_AFFINITY;
  const tick = conf.table?.tick ?? conf.tick ?? DEFAULT_TABLE_TICK_MS;
  const chunkSize =
    conf.table?.chunkSize ?? conf.chunkSize ?? DEFAULT_TABLE_CHUNK_SIZE;

  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`${simTable.name}(): {magenta chunkCount} must be integer {yellow > 0}`
  );
  assert.ok(
    Number.isFinite(tick) && tick >= 10,
    chalk`${simTable.name}(): {magenta tick} must be integer {yellow >= 10}`
  );
  assert.ok(
    0 <= affinity && affinity <= 1,
    chalk`${simTable.name}(): {magenta affinity} must be a number {yellow from 0 to 1}`
  );

  // Manual config should take precedence if the col/row values are provided
  const tableInfos = await getVenueTablesInfo(options);

  const tables: TableInfo[] =
    tableInfos?.length > 0
      ? tableInfos
      : template === "jazzbar"
      ? DEFAULT_JAZZ_TABLE_INFOS
      : DEFAULT_CONV_TABLE_INFOS;

  // keep track of who's already seated
  const seated: Record<string, boolean> = {};

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
          if (seated[userId] && Math.random() >= affinity) {
            return;
          }

          // more impatient users will sit down fast, then affinity to move will kick in
          if (!seated[userId] && Math.random() >= impatience) {
            return;
          }

          const table = pickValueFrom(tables);

          assert.ok(
            table,
            chalk`${simTable.name}(): {magenta table} must be provided to be able to sit`
          );

          const col = faker.datatype.number({ min: 0, max: table.col });
          const row = faker.datatype.number({ min: 0, max: table.row });

          // TODO: add logic checking for already taken seats

          await takeSeat({ ...options, ...table, row, col, userRef });
          seated[userId] = true;
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
