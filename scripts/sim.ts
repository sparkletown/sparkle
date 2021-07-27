#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport,JSVoidFunctionReturnValueUsed

import { strict as assert } from "assert";

import chalk from "chalk";
import { run } from "./lib/simulator";

import {
  ensureBotUsers as actualEnsureUsers,
  findVenue,
  findExperienceReactions,
} from "./lib/bot";
import { LogFunction, withErrorReporter } from "./lib/log";
import { simulateMove } from "./lib/simulate-move";
import { simulateExperience } from "./lib/simulate-experience";
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
    const { venue } = conf;
    const venueId = venue?.id;

    assert.ok(venueId, chalk`main(): {magenta venue.id} is required`);
    const venueRef = await findVenue({ log, venueId });
    assert.ok(
      venueRef,
      chalk`main(): venue was not found for {magenta venue.id}: {green ${venueId}}`
    );

    const reactionsRef = await findExperienceReactions({ venueId });

    const ensureUsers = withErrorReporter(
      { ...conf.log, critical: true },
      actualEnsureUsers
    );
    const userRefs = await ensureUsers({ log, stats, ...conf.user });

    stats.usersCount = userRefs.length;

    await simulateMove({ ...options, userRefs, venueRef, ...venue });
    await simulateExperience({ ...options, userRefs, venueRef, reactionsRef });

    return { venueRef, userRefs, reactionsRef };
  }
);
