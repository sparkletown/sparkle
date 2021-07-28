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
import { getReactionsRef, getChatRef } from "./lib/collections";
import { findVenue } from "./lib/documents";
import { withErrorReporter } from "./lib/log";
import { run } from "./lib/runner";
import { simulateChat } from "./lib/simulate-chat";
import { simulateExperience } from "./lib/simulate-experience";
import { simulateSeat } from "./lib/simulate-seat";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  RunContext,
  SimConfig,
} from "./lib/types";

type MainResult = {
  chatsRef: CollectionReference<DocumentData>;
  reactionsRef: CollectionReference<DocumentData>;
  userRefs: DocumentReference<DocumentData>[];
};

type CleanupOptions = RunContext<SimConfig> & { result: MainResult };

// noinspection JSIgnoredPromiseFromCall
run(
  async (options: RunContext<SimConfig>) => {
    const { conf, log } = options;
    const { venue, simulate = [] } = conf;
    const venueId = venue?.id;

    assert.ok(venueId, chalk`main(): {magenta venue.id} is required`);

    const venueRef = await findVenue({ log, venueId });
    const reactionsRef = await getReactionsRef({ venueId });
    const chatsRef = await getChatRef({ venueId });

    assert.ok(
      venueRef,
      chalk`main(): venue was not found for {magenta venue.id}: {green ${venueId}}`
    );

    const ensureBotUsers = withErrorReporter(
      { ...conf.log, critical: true },
      actualEnsureBotUsers
    );
    const userRefs = await ensureBotUsers({ ...options, ...conf.user });

    if (simulate.length === 0 || simulate.includes("seat")) {
      await simulateSeat({ ...options, userRefs, venueRef });
    }

    if (simulate.length === 0 || simulate.includes("experience")) {
      await simulateExperience({
        ...options,
        userRefs,
        venueRef,
        reactionsRef,
      });
    }

    if (simulate.length === 0 || simulate.includes("chat")) {
      await simulateChat({ ...options, userRefs, venueRef, chatsRef });
    }

    return { chatsRef, reactionsRef, userRefs };
  },
  async ({ conf, log, result, stats }: CleanupOptions) => {
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
      writes: unit && stats.writes ? stats.writes / unit : "N/A",
      relocations: unit && stats.relocations ? stats.relocations / unit : "N/A",
      reactions:
        unit && stats.reactions?.created
          ? stats.reactions.created / unit
          : "N/A",
      chatlines:
        unit && stats.chatlines?.created
          ? stats.chatlines.created / unit
          : "N/A",
    });

    const start = parseISO(stats.time?.start ?? "");
    const finish = parseISO(stats.time?.finish ?? "");

    stats.average = {
      "per.minute": calcPer(Math.abs(differenceInMinutes(start, finish))),
      "per.second": calcPer(Math.abs(differenceInSeconds(start, finish))),
    };
  }
);
