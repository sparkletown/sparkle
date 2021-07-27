import { strict as assert } from "assert";

import chalk from "chalk";
import faker from "faker";
import { log } from "./log";

const INDEX_PADDING = 4;
const INDEX_BASE = 10 ** INDEX_PADDING + 1;

// @see EmojiReactionType in types/reactions
// noinspection SpellCheckingInspection
const REACTIONS = Object.freeze([
  "heart",
  "clap",
  "wolf",
  "laugh",
  "thatsjazz",
  "boo",
  "burn",
  "sparkle",
  "messageToTheBand",
]);
const TEXTERS = Object.freeze([
  faker.hacker.phrase,
  faker.company.catchPhrase,
  faker.company.bs,
  faker.lorem.sentence,
  faker.random.words,
]);
export const generateRandomReaction = () =>
  REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
export const generateRandomText = () =>
  TEXTERS[Math.floor(Math.random() * TEXTERS.length)]();

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
    chalk`sleep(): ms must be integer {yellow >= 10}`
  );
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

type GenerateUserIdOptions = {
  scriptTag: string;
  index: number;
};

export const generateUserId: ({
  scriptTag,
  index,
}: GenerateUserIdOptions) => string = ({ scriptTag, index }) =>
  `${scriptTag}-` + `${index + INDEX_BASE}`.padStart(INDEX_PADDING, "0");

export const loopUntilKilled = () => {
  // The keep alive interval, prevents Node from simply finishing its run
  const intervalId = setInterval(() => undefined, 1000);

  // Waits until user tries to exit with CTRL-C
  return new Promise<void>((resolve) => {
    log(chalk`Press {redBright CTRL-C} to exit...`);

    process.on("SIGINT", () => {
      log(chalk`{redBright CTRL-C} detected, stopping simulation...`);
      clearInterval(intervalId);
      resolve();
    });
  });
};
