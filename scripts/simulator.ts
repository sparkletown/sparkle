#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";

import {
  ensureBotUsers as actualEnsureUsers,
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
} from "./lib/types";

// noinspection JSIgnoredPromiseFromCall
run<{
  chatsRef: CollectionReference<DocumentData>;
  reactionsRef: CollectionReference<DocumentData>;
  userRefs: DocumentReference<DocumentData>[];
}>(
  async (options) => {
    const { conf, log, stats } = options;
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

    const ensureUsers = withErrorReporter(
      { ...conf.log, critical: true },
      actualEnsureUsers
    );
    const userRefs = await ensureUsers({ log, stats, ...conf.user });

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
  async ({ conf, log, result, stats }) => {
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
  }
);
