#!/usr/bin/env node -r esm -r ts-node/register

import { strict as assert } from "assert";

import chalk from "chalk";
import {
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceStrict,
  parseISO,
} from "date-fns";

import {
  ensureBotUsers as actualEnsureBotUsers,
  removeBotChatMessages,
  removeBotReactions,
  removeBotUsers,
} from "./lib/bot";
import { getChatlinesRef, getReactionsRef } from "./lib/collections";
import { getVenueName, getVenueRef, getVenueTemplate } from "./lib/documents";
import { fetchSovereignVenue } from "./lib/fetch";
import { withErrorReporter } from "./lib/log";
import { run } from "./lib/runner";
import {
  CollectionReference,
  DocumentReference,
  RunContext,
  SimConfig,
  SimContext,
} from "./lib/types";
import { calculateAveragesPer } from "./lib/utils";
import { simChat } from "./simulation/chat";
import { simExperience } from "./simulation/experience";
import { simSeat } from "./simulation/seat";
import { simTable } from "./simulation/table";

type MainResult = {
  chatsRef?: CollectionReference;
  reactionsRef?: CollectionReference;
  userRefs: DocumentReference[];
};

const main: (options: RunContext<SimConfig>) => Promise<MainResult> = async (
  options
) => {
  const { conf, log, stats, stop } = options;
  const { venue, simulate = [] } = conf;

  // if conf.simulate (different from simulate) is undefined, run all, otherwise if set to an empty array, run none
  const shouldRunAll = typeof conf.simulate === "undefined";
  const shouldRunNone =
    Array.isArray(conf.simulate) && conf.simulate.length === 0;

  const ensureBotUsers = withErrorReporter(
    { ...conf.log, critical: true },
    actualEnsureBotUsers
  );
  const userRefs = await ensureBotUsers(options);

  if (shouldRunNone) {
    return { userRefs };
  }

  assert.ok(venue?.id, chalk`${main.name}(): {magenta venue.id} is required`);

  const venueId = venue.id;
  const venueRef = await getVenueRef({ log, venueId: venueId });
  const reactionsRef = await getReactionsRef({ venueId: venueId });
  const chatsRef = await getChatlinesRef({ venueId: venueId });

  assert.ok(
    venueRef,
    chalk`${main.name}(): venue was not found for {magenta venue.id}: {green ${venueId}}`
  );

  const template = await getVenueTemplate({ log, venueRef });
  assert.ok(
    template,
    chalk`${main.name}(): venue with {magenta venue.id}: {green ${venueId}} has invalid {magenta venue.template}: {red ${template}}`
  );

  const venueName = await getVenueName({ log, venueRef });
  assert.ok(
    venueName,
    chalk`${main.name}(): venue with {magenta venue.id}: {green ${venueId}} has invalid {magenta venue.name}: {red ${venueName}}`
  );

  const sovereignVenue = await fetchSovereignVenue(venueId);

  const simulatorContext: SimContext = {
    ...options,
    userRefs,
    chatsRef,
    reactionsRef,
    template,
    venueId: venueRef.id,
    venueName,
    venueRef,
    sovereignVenue,
  };

  const simulations = [];
  const simStart = new Date();

  stop.then(() => {
    const simFinish = new Date();
    stats.sim = {
      start: simStart.toISOString(),
      finish: simFinish.toISOString(),
      run: formatDistanceStrict(simFinish, simStart),
    };
  });

  if (shouldRunAll || simulate.includes("chat")) {
    simulations.push(simChat(simulatorContext));
  }

  if (shouldRunAll || simulate.includes("experience")) {
    simulations.push(simExperience(simulatorContext));
  }

  if (shouldRunAll || simulate.includes("seat")) {
    simulations.push(simSeat(simulatorContext));
  }

  if (shouldRunAll || simulate.includes("table")) {
    simulations.push(simTable(simulatorContext));
  }

  await Promise.all(simulations);

  return { chatsRef, reactionsRef, userRefs };
};

const cleanup: (
  options: RunContext<SimConfig> & {
    result: MainResult;
  }
) => Promise<void> = async (options) => {
  // and now, clean up the mess

  const { conf, stats, log } = options;
  const { chatsRef, reactionsRef, userRefs } = options.result;

  if (conf.user?.cleanup ?? true) {
    log(chalk`{inverse NOTE} Doing little user cleanup...`);
    await removeBotUsers({ ...options, userRefs });
    log(chalk`{green.inverse DONE} Removed bot users.`);
  }

  if (reactionsRef && (conf.experience?.cleanup ?? true)) {
    log(chalk`{inverse NOTE} Doing little reactions cleanup...`);
    await removeBotReactions({ ...options, reactionsRef });
    log(chalk`{green.inverse DONE} Removed bot reactions.`);
  }

  if (chatsRef && (conf.chat?.cleanup ?? true)) {
    log(chalk`{inverse NOTE} Doing little reactions cleanup...`);
    await removeBotChatMessages({ ...options, chatsRef });
    log(chalk`{green.inverse DONE} Removed bot reactions.`);
  }

  const start = parseISO(stats.sim?.start ?? "");
  const finish = parseISO(stats.sim?.finish ?? "");

  const minutes = Math.abs(differenceInMinutes(start, finish));
  const seconds = Math.abs(differenceInSeconds(start, finish));

  stats.average = {
    "per.minute": calculateAveragesPer(minutes, stats),
    "per.second": calculateAveragesPer(seconds, stats),
  };
};

// noinspection JSIgnoredPromiseFromCall
run(main, cleanup);
