import { strict as assert } from "assert";
import { existsSync, readFileSync } from "fs";
import { relative, resolve } from "path";

import chalk from "chalk";
import { addMinutes, formatISO } from "date-fns";
import faker from "faker";
import JSON5 from "json5";

import { log } from "./log";
import { SimConfig, StopSignal } from "./types";

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

export const pickFrom: <T>(array: T[]) => T | undefined = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const generateRandomReaction = () => pickFrom(REACTIONS);
export const generateRandomText = () => pickFrom(TEXTERS)?.();

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

type GenerateUserIdOptions = {
  scriptTag: string;
  index: number;
};

export const generateUserId: ({
  scriptTag,
  index,
}: GenerateUserIdOptions) => string = ({ scriptTag, index }) =>
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

type ReadConfigOptions = {
  name: string;
  dir: string;
  ext: string | string[];
};

type ReadConfigResult = {
  conf: SimConfig;
  filename: string;
  text: string;
};

export const readConfig: (options: ReadConfigOptions) => ReadConfigResult = ({
  name,
  dir,
  ext,
}) => {
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
