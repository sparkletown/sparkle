import { strict as assert } from "assert";
import { resolve, parse, sep } from "path";

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
import { SimConfig, SimStats } from "./types";
import { loopUntilKilled, readConfig } from "./utils";

export const SIM_EXT = [".config.json5", ".config.json"];

export type InitFirebaseOptions = {
  log: LogFunction;
  conf: SimConfig;
  stats: SimStats;
};

export const initFirebase: (options: InitFirebaseOptions) => void = ({
  log,
  conf: { credentials, projectId },
  stats,
}) => {
  log(
    chalk`{inverse NOTE} Initializing Firebase with {green ${credentials}} for project {green ${projectId}}...`
  );

  assert.ok(projectId, chalk`initFirebase(): {magenta projectId} is required`);

  stats.credentialsFilename = credentials
    ? resolve(process.cwd(), credentials)
    : undefined;

  initFirebaseAdminApp(projectId, {
    credentialPath: stats.credentialsFilename,
  });

  log(
    chalk`{green.inverse DONE} Initialized  Firebase for {green ${projectId}}.`
  );
};

export type RunCallbackOptions = {
  conf: SimConfig;
  log: LogFunction;
  stats: SimStats;
  stop: Promise<void>;
};

export const run: <T>(
  main: (options: RunCallbackOptions) => Promise<T>,
  cleanup: (options: RunCallbackOptions & { result: T }) => Promise<void>
) => Promise<void> = async (main, cleanup) => {
  try {
    const startTime = new Date();
    const dir = `.${sep}${parse(process.argv[1]).name}${sep}`;
    const confName = process.argv[2];

    if (!confName) {
      displayHelp({ dir, ext: "(" + SIM_EXT.join("|") + ")" });
      process.exit(0);
      return;
    }

    // setup before running main
    const stop: Promise<void> = loopUntilKilled();

    const { conf, filename } = readConfig({
      name: confName,
      dir,
      ext: SIM_EXT,
    });
    const stats: SimStats = { configurationFilename: filename };
    const log = conf?.log?.verbose ? actualLog : () => undefined;

    initFirebase({ log, conf, stats });

    // run main, then wait for the stop signal, then pass the result for cleanup
    const result = await main({ stats, conf, log, stop });
    await stop;
    await cleanup({ stats, conf, log, stop, result });

    // wrap up console logging
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

    log(chalk`{red.inverse ERRR} {red ${e.message}}`);
    log(chalk`{dim ${e.stack}}`);

    process.exit(-1);
  }
};
