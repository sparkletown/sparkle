import { strict as assert } from "assert";
import { existsSync, readFileSync } from "fs";
import { relative, resolve } from "path";

import chalk from "chalk";
import {
  addMinutes,
  formatDistanceStrict,
  formatISO,
  parseISO,
} from "date-fns";
import faker from "faker";
import JSON5 from "json5";

import { log, NOT_AVAILABLE } from "./log";
import {
  Grid,
  GridPosition,
  GridSize,
  ScriptRunTime,
  SeatedUsersMap,
  SectionGridPosition,
  SimAverages,
  SimConfig,
  SimStats,
  StopSignal,
  TableInfo,
} from "./types";

const INDEX_PADDING = 4;
const INDEX_BASE = 10 ** INDEX_PADDING + 1;

// @see EmojiReactionType in types/reactions
// noinspection SpellCheckingInspection
const REACTIONS = [
  "heart",
  "clap",
  "wolf",
  "laugh",
  "thatsjazz",
  "boo",
  "burn",
  "sparkle",
  "messageToTheBand",
];

const TEXTERS = [
  faker.hacker.phrase,
  faker.company.catchPhrase,
  faker.company.bs,
  faker.lorem.sentence,
  faker.random.words,
];

export const pickIndexFor: <T>(array: T[]) => number = (array) =>
  Math.floor(Math.random() * array.length);

export const pickValueFrom: <T>(array: T[]) => T | undefined = (array) =>
  array[pickIndexFor(array)];

export const generateRandomReaction = () => pickValueFrom(REACTIONS);
export const generateRandomText = () => pickValueFrom(TEXTERS)?.();

// export const STOP = Symbol("stop");
// export const withLoop: (tick: number, fn: Function) => Function = (
//   tick,
//   fn
// ) => {
//   const loop = async () => {
//     const signal = fn();
//     if (signal !== STOP) {
//       setTimeout(loop, tick);
//     }
//   };
//   return loop;
// };

export const sleep: (ms: number) => Promise<void> = (ms) => {
  assert.ok(
    Number.isFinite(ms) && ms >= 10,
    chalk`${sleep.name}(): {magenta ms} must be integer {yellow >= 10}`
  );
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export const determineScriptRelativeFilename = () =>
  relative(process.cwd(), process.argv[1]);

export const generateUserId: (options: {
  scriptTag: string;
  index: number;
}) => string = ({ scriptTag, index }) =>
  `${scriptTag}-` + `${index + INDEX_BASE}`.padStart(INDEX_PADDING, "0");

export const loopUntilKilled: (
  timeoutInMinutes?: number
) => Promise<StopSignal> = (timeout) => {
  // timeout is set in minutes
  const endpoint = timeout
    ? addMinutes(new Date(), timeout).getTime()
    : undefined;

  // handle for the resolve function to be used inside the interval-ed function
  let stop: (value: PromiseLike<StopSignal> | StopSignal) => void;

  // The keep alive interval, prevents Node from simply finishing its run
  const intervalId = setInterval(() => {
    if (!endpoint) return;
    if (endpoint > new Date().getTime()) return;
    log(chalk`{blue.inverse INFO} {redBright Timeout} reached, stopping...`);
    clearInterval(intervalId);
    stop?.("timeout");
  }, 1000);

  // Waits until user tries to exit with CTRL-C
  return new Promise<StopSignal>((resolve) => {
    stop = resolve;
    if (endpoint) {
      log(
        chalk`{blue.inverse INFO} Timeout set at {redBright ${formatISO(
          endpoint
        )}}.`
      );
    }
    log(chalk`{blue.inverse INFO} Press {redBright CTRL-C} to exit...`);

    process.on("SIGINT", () => {
      log(chalk`{blue.inverse INFO} {redBright CTRL-C} detected, stopping...`);
      clearInterval(intervalId);
      resolve("sigint");
    });
  });
};

export const readConfig: (options: {
  name: string;
  dir: string;
  ext: string | string[];
}) => {
  conf: SimConfig;
  filename: string;
  text: string;
} = ({ name, dir, ext }) => {
  const extensions: string[] = Array.isArray(ext) ? ext : [ext];

  for (const extension of extensions) {
    const filename = resolve(process.cwd(), dir + name + extension);
    if (!existsSync(filename)) {
      continue;
    }

    const text = readFileSync(filename).toString();

    try {
      const conf = JSON5.parse(text);
      return { conf, filename, text };
    } catch (e) {
      throw new Error(chalk`Couldn't parse {green ${filename}}. ` + e.message);
    }
  }

  throw new Error(
    chalk`Configuration file was not found for {green ${resolve(
      process.cwd(),
      dir + name
    )}.(${extensions.join("|")})}`
  );
};

export const generateSingleTableFor = (
  index: number,
  defaults: Pick<TableInfo, "cap" | "col" | "row">
) => {
  const idx = String(index + 1);
  const dub = `Table ${idx}`;
  return {
    ...defaults,
    dub,
    idx,
    ref: dub,
  };
};

export const generateMultipleTablesFor: (
  count: number,
  defaults: Pick<TableInfo, "cap" | "col" | "row">
) => TableInfo[] = (count, defaults) =>
  Array(count)
    .fill(undefined)
    .map((_, index) => generateSingleTableFor(index, defaults));

export const increment: (value: number | undefined) => number = (value) =>
  (value ?? 0) + 1;

export const calculateAveragesPer: (
  unit: number,
  stats: SimStats
) => SimAverages = (unit, stats) => ({
  writes:
    unit && stats.writes ? (stats.writes / unit).toFixed(2) : NOT_AVAILABLE,
  relocations:
    unit && stats.relocations
      ? (stats.relocations / unit).toFixed(2)
      : NOT_AVAILABLE,
  reactions:
    unit && stats.reactions?.created
      ? (stats.reactions.created / unit).toFixed(2)
      : NOT_AVAILABLE,
  chatlines:
    unit && stats.chatlines?.created
      ? (stats.chatlines.created / unit).toFixed(2)
      : NOT_AVAILABLE,
});

export const calculateScriptRunTime: (options: {
  stats: SimStats;
  start: Date;
  finish: Date;
}) => ScriptRunTime = ({ stats, start, finish }) => ({
  start: start.toISOString(),
  finish: finish.toISOString(),
  run: formatDistanceStrict(finish, start),
  init: stats?.sim?.start
    ? formatDistanceStrict(start, parseISO(stats.sim.start))
    : NOT_AVAILABLE,
  cleanup: stats?.sim?.finish
    ? formatDistanceStrict(finish, parseISO(stats.sim.finish))
    : NOT_AVAILABLE,
});

export const SECTION_VIDEO_MIN_WIDTH_IN_SEATS = 17;

const getVideoSizeInSeats = (columnCount: number) => {
  // Video takes 1/3 of the seats
  const videoWidthInSeats = Math.max(
    Math.floor(columnCount / 3),
    SECTION_VIDEO_MIN_WIDTH_IN_SEATS
  );

  // Keep the 4:3 ratio
  const videoHeightInSeats =
    Math.ceil(videoWidthInSeats * (3 / 4)) +
    //+3 for extra UI elements
    3;

  return {
    videoHeightInSeats,
    videoWidthInSeats,
  };
};

export const getGridFromGridSize = (gridSize: GridSize) => {
  const rows = new Array(gridSize.auditoriumRows);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = new Array(gridSize.auditoriumColumns).fill("");
  }
  return rows;
};

//@debt implement more efficient data structure for finding next free seat
export const findFreeSeat = (
  userId: string,
  sectionIds: string[],
  seatedUsersMap: SeatedUsersMap,
  grids: Record<string, Grid>
): SectionGridPosition | undefined => {
  for (const sectionId of sectionIds) {
    const pos = getNextFreeSeat(grids[sectionId]);
    if (!pos) continue;

    grids[sectionId][pos.row][pos.col] = userId;

    const oldPos = seatedUsersMap[userId];
    if (oldPos) grids[oldPos.sectionId][oldPos.row][oldPos.col] = "";

    const result = {
      ...pos,
      sectionId,
    };

    seatedUsersMap[userId] = result;
    return result;
  }
};

const getNextFreeSeat = (grid: string[][]): GridPosition | undefined => {
  const rows = grid.length;
  const columns = grid[0].length;

  const { videoHeightInSeats, videoWidthInSeats } = getVideoSizeInSeats(
    columns
  );

  const videoRowThresholdLo = Math.floor((rows - videoHeightInSeats) / 2);
  const videoRowThresholdHi = videoRowThresholdLo + videoHeightInSeats;

  const videoColThresholdLo = Math.floor((columns - videoWidthInSeats) / 2);
  const videoColThresholdHi = videoColThresholdLo + videoWidthInSeats;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (
        row >= videoRowThresholdLo &&
        row < videoRowThresholdHi &&
        col >= videoColThresholdLo &&
        col < videoColThresholdHi
      )
        continue;

      if (!grid[row][col]) {
        return { row, col };
      }
    }
  }

  return undefined;
};
