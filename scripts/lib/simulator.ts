import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { resolve } from "path";

import chalk from "chalk";
import { formatDistanceStrict } from "date-fns";

import { initFirebaseAdminApp } from "./helpers";
import { log, SCRIPT, LogFunction } from "./log";

export type SimStats = Partial<{
  startTime: string;
  finishTime: string;
  runTime: string;
  configurationFilename: string;
  credentialsFilename: string;
  usersCount: number;
  usersCreated: number;
  usersUpdated: number;
  relocations: number;
}>;

export type SimConfig = Partial<{
  projectId: string;
  verbose: boolean;
  credentials: string;
  user: Partial<{
    scriptTag: string;
    count: number;
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
    process.on("SIGINT", () => {
      log(chalk`{redBright CTRL-C} detected, stopping simulation...`);
      clearInterval(intervalId);
      resolve();
    });
  });
};

export const run = async (main: () => Promise<Record<string, unknown>>) => {
  try {
    const stats = await main();

    await stopSignal();

    const finishTime = new Date();
    stats.finishTime = finishTime.toISOString();
    stats.runTime = formatDistanceStrict(
      finishTime,
      Date.parse("" + stats.startTime)
    );

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

type InitOptions = {
  log: LogFunction;
  conf: SimConfig;
  stats: SimStats;
};

export const init = ({
  log,
  conf: { credentials, projectId },
  stats,
}: InitOptions) => {
  log(
    chalk`initializing Firebase with {green ${credentials}} for project {green ${projectId}}...`
  );

  assert.ok(projectId, chalk`init(): {magenta projectId} is required`);

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
