import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { resolve } from "path";

import chalk from "chalk";
import { formatDistanceStrict } from "date-fns";

import { initFirebaseAdminApp } from "./helpers";
import {
  log,
  SCRIPT,
  LogFunction,
  displayHelp,
  log as actualLog,
  displayProps,
} from "./log";
import { removeBotUsers, removeBotReactions } from "./bot";
import { MainOptions, MainResult } from "../sim";
import { SimConfig, SimStats } from "./types";
import { loopUntilKilled } from "./utils";

export const SIM_DIR = "./simulator/";
export const SIM_EXT = ".config.json";

type InitOptions = {
  log: LogFunction;
  conf: SimConfig;
  stats: SimStats;
};

export const initFirebase = ({
  log,
  conf: { credentials, projectId },
  stats,
}: InitOptions) => {
  log(
    chalk`initializing Firebase with {green ${credentials}} for project {green ${projectId}}...`
  );

  assert.ok(projectId, chalk`initFirebase(): {magenta projectId} is required`);

  stats.credentialsFilename = credentials
    ? resolve(process.cwd(), credentials)
    : undefined;

  initFirebaseAdminApp(projectId, {
    credentialPath: stats.credentialsFilename,
  });

  log(
    chalk`{green.inverse DONE} initialized Firebase for {green ${projectId}}.`
  );
};

type ReadConfigOptions = {
  name: string;
  dir: string;
  ext: string;
};

type ReadConfigResult = {
  conf: SimConfig;
  configurationFilename: string;
};

export const readConfig: (options: ReadConfigOptions) => ReadConfigResult = ({
  name,
  dir,
  ext,
}) => {
  const configurationFilename = resolve(process.cwd(), dir + name + ext);
  const conf = JSON.parse(readFileSync(configurationFilename).toString());

  return { conf, configurationFilename };
};

export const run: (
  main: (options: MainOptions) => Promise<MainResult>
) => Promise<void> = async (main) => {
  try {
    const startTime = new Date();
    const confName = process.argv[2];

    if (!confName) {
      displayHelp({ dir: SIM_DIR, ext: SIM_EXT });
      process.exit(0);
      return;
    }

    // setup before running main
    const stop: Promise<void> = loopUntilKilled();

    const { conf, configurationFilename } = readConfig({
      name: confName,
      dir: SIM_DIR,
      ext: SIM_EXT,
    });
    const stats: SimStats = { configurationFilename };
    const log = conf?.log?.verbose ? actualLog : () => undefined;

    initFirebase({ log, conf, stats });

    // run main, then wait for the stop signal
    const { userRefs, reactionsRef } = await main({ stats, conf, log, stop });
    await stop;

    // do some cleanup before terminating
    if (conf.user?.cleanup ?? true) {
      log(chalk`{inverse NOTE} Doing little user cleanup...`);
      await removeBotUsers({ conf, log, stats, userRefs });
      log(chalk`{green.inverse DONE} Removed bot users.`);
    }

    // do some cleanup before terminating
    if (conf.experience?.cleanup ?? true) {
      log(chalk`{inverse NOTE} Doing little reactions cleanup...`);
      await removeBotReactions({ conf, log, stats, reactionsRef });
      log(chalk`{green.inverse DONE} Removed bot reactions.`);
    }

    const finishTime = new Date();
    stats.startTime = startTime.toISOString();
    stats.finishTime = finishTime.toISOString();
    stats.runTime = formatDistanceStrict(finishTime, startTime);

    log(chalk`{white Some useful stats:}`);
    displayProps(stats);

    log(chalk`{green.inverse DONE} Running {green ${SCRIPT}}.`);
    process.exit(0);
  } catch (e) {
    chalk.reset();

    log(chalk`{red.inverse ERROR} {red ${e.message}}`);
    log(chalk`{dim ${e.stack}}`);

    process.exit(-1);
  }
};
