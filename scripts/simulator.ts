#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";
import { differenceInSeconds, parseISO, differenceInMinutes } from "date-fns";

import {
  ensureBotUsers as actualEnsureBotUsers,
  removeBotUsers,
  removeBotReactions,
  removeBotChatMessages,
} from "./lib/bot";
import { getReactionsRef, getChatlinesRef } from "./lib/collections";
import { findVenue } from "./lib/documents";
import { withErrorReporter } from "./lib/log";
import { run } from "./lib/runner";
import {
  CollectionReference,
  DocumentReference,
  RunContext,
  SimConfig,
} from "./lib/types";

import { simChat } from "./simulation/chat";
import { simExperience } from "./simulation/experience";
import { simSeat } from "./simulation/seat";

export type MainResult = {
  chatsRef: CollectionReference;
  reactionsRef: CollectionReference;
  userRefs: DocumentReference[];
};

export type CleanupOptions = RunContext<SimConfig> & { result: MainResult };

export type SimulatorContext = RunContext<SimConfig> & {
  chatsRef: CollectionReference;
  reactionsRef: CollectionReference;
  userRefs: DocumentReference[];
  venueId: string;
  venueRef: DocumentReference;
};

const main = async (options: RunContext<SimConfig>) => {
  const { conf, log } = options;
  const { venue, simulate = [] } = conf;
  const venueId = venue?.id;

  assert.ok(venueId, chalk`${main.name}(): {magenta venue.id} is required`);

  const venueRef = await findVenue({ log, venueId });
  const reactionsRef = await getReactionsRef({ venueId });
  const chatsRef = await getChatlinesRef({ venueId });

  assert.ok(
    venueRef,
    chalk`${main.name}(): venue was not found for {magenta venue.id}: {green ${venueId}}`
  );

  const ensureBotUsers = withErrorReporter(
    { ...conf.log, critical: true },
    actualEnsureBotUsers
  );
  const userRefs = await ensureBotUsers({ ...options, ...conf.user });

  const simulatorContext: SimulatorContext = {
    ...options,
    userRefs,
    chatsRef,
    reactionsRef,
    venueRef,
    venueId: venueRef.id,
  };

  // if conf.simulate (different from simulate) is undefined, run all, otherwise if set to an empty array, run none
  const shouldRunAll = !Array.isArray(conf.simulate);
  const simulations = [];

  if (shouldRunAll || simulate.includes("chat")) {
    simulations.push(simChat(simulatorContext));
  }

  if (shouldRunAll || simulate.includes("experience")) {
    simulations.push(simExperience(simulatorContext));
  }

  if (shouldRunAll || simulate.includes("seat")) {
    simulations.push(simSeat(simulatorContext));
  }

  await Promise.all(simulations);

  return { chatsRef, reactionsRef, userRefs };
};

const cleanup: (options: CleanupOptions) => Promise<void> = async ({
  conf,
  log,
  result,
  stats,
}) => {
  // and now, clean up the mess

  if (conf.user?.cleanup ?? true) {
    log(chalk`{inverse NOTE} Doing little user cleanup...`);
    const userRefs = result.userRefs;
    await removeBotUsers({ conf, log, stats, userRefs });
    log(chalk`{green.inverse DONE} Removed bot users.`);
  }

  if (conf.experience?.cleanup ?? true) {
    log(chalk`{inverse NOTE} Doing little reactions cleanup...`);
    const reactionsRef = result.reactionsRef;
    await removeBotReactions({ conf, log, stats, reactionsRef });
    log(chalk`{green.inverse DONE} Removed bot reactions.`);
  }

  if (conf.chat?.cleanup ?? true) {
    log(chalk`{inverse NOTE} Doing little reactions cleanup...`);
    const chatsRef = result.chatsRef;
    await removeBotChatMessages({ conf, log, stats, chatsRef });
    log(chalk`{green.inverse DONE} Removed bot reactions.`);
  }

  const calcPer = (unit: number) => ({
    writes: unit && stats.writes ? (stats.writes / unit).toFixed(2) : "N/A",
    relocations:
      unit && stats.relocations ? (stats.relocations / unit).toFixed(2) : "N/A",
    reactions:
      unit && stats.reactions?.created
        ? (stats.reactions.created / unit).toFixed(2)
        : "N/A",
    chatlines:
      unit && stats.chatlines?.created
        ? (stats.chatlines.created / unit).toFixed(2)
        : "N/A",
  });

  const start = parseISO(stats.time?.start ?? "");
  const finish = parseISO(stats.time?.finish ?? "");

  stats.average = {
    "per.minute": calcPer(Math.abs(differenceInMinutes(start, finish))),
    "per.second": calcPer(Math.abs(differenceInSeconds(start, finish))),
  };
};

// noinspection JSIgnoredPromiseFromCall
run(main, cleanup);
