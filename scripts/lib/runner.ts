import { strict as assert } from "assert";
import { parse, resolve, sep } from "path";

import chalk from "chalk";

import { initFirebaseAdminApp } from "./helpers";
import {
  displayHelp,
  displayProps,
  log as actualLog,
  log,
  SCRIPT,
} from "./log";
import { LogFunction, SimConfig, SimStats, StopSignal } from "./types";
import { calculateScriptRunTime, loopUntilKilled, readConfig } from "./utils";

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

  assert.ok(
    projectId,
    chalk`${initFirebase.name}(): {magenta projectId} is required`
  );

  (stats.file ??= {}).credentials = credentials
    ? resolve(process.cwd(), credentials)
    : undefined;

  initFirebaseAdminApp(projectId, {
    credentialPath: stats.file.credentials,
  });

  log(
    chalk`{green.inverse DONE} Initialized  Firebase for {green ${projectId}}.`
  );
};

export const run: (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  main: (options: any) => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cleanup: (options: { result: any } & any) => Promise<void>
) => Promise<void> = async (main, cleanup) => {
  // just to pass one single configuration setting (if available)
  // to the catch clause, thus avoid having try-catch inside try-catch
  let isErrorStackToBeDisplayed;
  try {
    const dir = `.${sep}${parse(process.argv[1]).name}${sep}`;
    const confName = process.argv[2];

    if (!confName) {
      displayHelp({ dir, ext: "(" + SIM_EXT.join("|") + ")" });
      process.exit(0);
      return;
    }

    // setup before running main
    const scriptStart = new Date();

    const { conf, filename } = readConfig({
      name: confName,
      dir,
      ext: SIM_EXT,
    });

    isErrorStackToBeDisplayed = conf?.log?.stack;
    const log = conf?.log?.verbose ? actualLog : () => undefined;
    const stats: SimStats = { file: { configuration: filename } };

    initFirebase({ log, conf, stats });

    // run main, then wait for the stop signal, then pass the result for cleanup

    const stop: Promise<StopSignal> =
      conf.keepAlive ?? true
        ? loopUntilKilled(conf.timeout)
        : Promise.resolve("timeout");

    const result = await main({ stats, conf, log, stop });
    await stop;

    await cleanup({ stats, conf, log, stop, result });

    stats.script = calculateScriptRunTime({
      stats,
      start: scriptStart,
      finish: new Date(),
    });

    // wrap up console logging
    log(chalk`{blue.inverse INFO} {white Some useful stats:}`);
    displayProps(stats);
    log(chalk`{green.inverse DONE} Running {green ${SCRIPT}}.`);

    process.exit(0);
  } catch (e) {
    chalk.reset();

    log(chalk`{red.inverse HALT} {red ${e.message}}`);
    if (isErrorStackToBeDisplayed ?? true) {
      log(chalk`{dim ${e.stack}}`);
    }

    process.exit(-1);
  }
};
