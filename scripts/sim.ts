#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";

import {
  ensureBotUsers as actualEnsureUsers,
  findVenue,
  findExperienceReactions,
} from "./lib/bot";
import { LogFunction, withErrorReporter } from "./lib/log";
import { simulateSeat } from "./lib/simulate-seat";
import { simulateExperience } from "./lib/simulate-experience";
import { run } from "./lib/simulator";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  SimConfig,
  SimStats,
} from "./lib/types";

export type MainOptions = {
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
  stop: Promise<void>;
};

export type MainResult = {
  userRefs: DocumentReference<DocumentData>[];
  venueRef: DocumentReference<DocumentData>;
  reactionsRef: CollectionReference<DocumentData>;
};

// noinspection JSIgnoredPromiseFromCall
run(
  async (options: MainOptions): Promise<MainResult> => {
    const { conf, log, stats } = options;
    const { venue, simulate = [] } = conf;
    const venueId = venue?.id;

    assert.ok(venueId, chalk`main(): {magenta venue.id} is required`);

    const venueRef = await findVenue({ log, venueId });
    const reactionsRef = await findExperienceReactions({ venueId });

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
      await simulateSeat({ ...options, userRefs, venueRef, ...venue });
    }

    if (simulate.length === 0 || simulate.includes("experience")) {
      assert.ok(
        reactionsRef,
        chalk`main(): venue reactions were not found for {magenta venue.id}: {green ${venueId}}`
      );
      await simulateExperience({
        ...options,
        userRefs,
        venueRef,
        reactionsRef,
      });
    }

    return { venueRef, userRefs, reactionsRef };
  }
);
