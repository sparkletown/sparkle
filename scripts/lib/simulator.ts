import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { resolve } from "path";

import chalk from "chalk";
import { formatDistanceStrict } from "date-fns";

import { initFirebaseAdminApp } from "./helpers";
import { log, SCRIPT, LogFunction, displayHelp, log as actualLog } from "./log";
import { removeBotUsers } from "./bot";
import { MainOptions, MainResult } from "../sim";

export const SIM_DIR = "./simulator/";
export const SIM_EXT = ".config.json";

export type SimStats = Partial<{
  startTime: string;
  finishTime: string;
  runTime: string;
  configurationFilename: string;
  credentialsFilename: string;
  usersCount: number;
  usersCreated: number;
  usersUpdated: number;
  usersRemoved: number;
  relocations: number;
}>;

export type SimConfig = Partial<{
  projectId: string;
  verbose: boolean;
  credentials: string;
  user: Partial<{
    scriptTag: string;
    count: number;
    cleanup: boolean;
  }>;
  venue: Partial<{
    id: string;
    minRow: number;
    minCol: number;
    maxRow: number;
    maxCol: number;
    chunkSize: number;
  }>;
  chunkSize: number;
  tick: number;
  seat: Partial<{
    chunkSize: number;
    tick: number;
    affinity: number;
  }>;
  chat: Partial<{
    chunkSize: number;
    tick: number;
  }>;
}>;

export const stopSignal = () => {
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

const displayStats: (stats: Record<string, unknown>) => void = (stats) => {
  chalk.reset();
  log(chalk`{white Some useful stats:}`);

  for (const [key, val] of Object.entries(stats ?? {})) {
    if (val === null || val === undefined) {
      log(chalk`{magenta ${key}}: {redBright ${val}}`);
    } else if (val === true || val === false) {
      log(chalk`{magenta ${key}}: {blueBright ${val}}`);
    } else if (typeof val === "string") {
      log(chalk`{magenta ${key}}: {green ${val}}`);
    } else if (typeof val === "number") {
      log(chalk`{magenta ${key}}: {yellow ${val}}`);
    } else {
      log(chalk`{magenta ${key}}: {dim ${val}}`);
    }
  }
};

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
    const { conf, configurationFilename } = readConfig({
      name: confName,
      dir: SIM_DIR,
      ext: SIM_EXT,
    });
    const { verbose = false } = conf;
    const stats: SimStats = { configurationFilename };
    const log = verbose ? actualLog : () => undefined;

    initFirebase({ log, conf, stats });

    // run main, then wait for the stop signal
    const { userRefs } = await main({ stats, conf, log });
    await stopSignal();

    // do some cleanup before terminating
    if (conf.user?.cleanup ?? true) {
      log(chalk`Doing little user cleanup...`);
      await removeBotUsers({ log, stats, userRefs });
      log(chalk`{green.inverse DONE} Removed bot users.`);
    }

    const finishTime = new Date();
    stats.startTime = startTime.toISOString();
    stats.finishTime = finishTime.toISOString();
    stats.runTime = formatDistanceStrict(finishTime, startTime);

    displayStats(stats);

    log(chalk`{green.inverse DONE} Running {green ${SCRIPT}}.`);
    process.exit(0);
  } catch (e) {
    chalk.reset();

    log(chalk`{red.inverse ERROR} {red ${e.message}}`);
    log(chalk`{dim ${e.stack}}`);

    process.exit(-1);
  }
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

export const sleep: (ms: number) => Promise<void> = (ms) => {
  assert.ok(
    Number.isFinite(ms) && ms >= 10,
    chalk`sleep(): ms must be integer {yellow >= 10}`
  );
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};
