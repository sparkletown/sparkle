import chalk from "chalk";

import { checkTypeObject } from "./guards";
import { LogFunction } from "./types";
import { determineScriptRelativeFilename } from "./utils";

export const NOT_AVAILABLE = "N/A";

// NOTE: just caching the result since it shouldn't change while the script is running
export const SCRIPT = determineScriptRelativeFilename();

export const log: LogFunction = (...args: Parameters<LogFunction>) => {
  chalk.reset();
  const now = new Date().toISOString();
  console.log(chalk`{dim [${SCRIPT}][${now}]}`, ...args);
};

export type DisplayHelpOptions = {
  dir: string;
  ext: string;
};

export const displayHelp: ({ dir, ext }: DisplayHelpOptions) => void = ({
  dir,
  ext,
}) => {
  chalk.reset();
  log(chalk`

Usage: {white ${SCRIPT}} {dim ${dir}}{white name}{dim ${ext}}

{inverse NOTE}: Provide only the {magenta name} part, the {magenta directory} and {magenta extension} will be added automatically

`);
};

export const withErrorReporter: <T extends Function>(
  options:
    | undefined
    | {
        verbose?: boolean;
        critical?: boolean;
        stack?: boolean;
      },
  asyncFunction: T
) => T = (options, asyncFunction) => {
  const { critical = false, stack = true, verbose = true } = options ?? {};

  if (!verbose) {
    return asyncFunction;
  }

  const functionName = asyncFunction.name ?? "anonymousAsyncFunction";
  const wrapperName = `withErrorReporter(${functionName})`;

  // NOTE: this is a way for JS to set the name of the wrapper function
  const temporaryObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [wrapperName]: (...args: any[][]) => {
      const promise = asyncFunction(...args);
      const handled = promise.catch((e: Error) => {
        chalk.reset();

        log(
          chalk`{red.inverse ERRR} {dim withErrorReporter(}{white ${functionName}}{dim )}{white :} {red ${e.message}}`
        );

        if (stack) {
          log(chalk`{dim ${e.stack}}`);
        }
      });

      // NOTE: the handled one will not re-throw the error
      return critical ? promise : handled;
    },
  };

  return temporaryObject[wrapperName] as unknown as typeof asyncFunction;
};

export const displayProps: (
  stats: Record<string, unknown>,
  prefix?: string
) => void = (stats, prefix = "") => {
  prefix = prefix ? prefix + "." : "";

  for (const [key, val] of Object.entries(stats ?? {})) {
    if (val === null || val === undefined || Number.isNaN(val)) {
      log(chalk`{magenta ${prefix + key}}: {redBright ${val}}`);
    } else if (val === true || val === false) {
      log(chalk`{magenta ${prefix + key}}: {blueBright ${val}}`);
    } else {
      if (val === NOT_AVAILABLE) {
        log(chalk`{magenta ${prefix + key}}: {green.dim ${val}}`);
      } else if (typeof val === "string") {
        log(chalk`{magenta ${prefix + key}}: {green ${val}}`);
      } else if (typeof val === "number") {
        log(chalk`{magenta ${prefix + key}}: {yellow ${val}}`);
      } else if (checkTypeObject(val)) {
        displayProps(val as Record<string, unknown>, prefix + key);
      } else {
        log(chalk`{magenta ${prefix + key}}: {dim ${val}}`);
      }
    }
  }
};
