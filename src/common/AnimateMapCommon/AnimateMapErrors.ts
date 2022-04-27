type ConsoleLevel = "error" | "warn" | "log";
type CauseInMessage = "ignore" | "append" | "replace";

type AnimateMapErrorOptions = {
  message?: string;
  where?: string;
  args?: unknown;
  cause?: Error | string;
  causeInMessage?: CauseInMessage;
  consoleLevel?: ConsoleLevel;
};

type GenerateMessage = (options: {
  causeInMessage: CauseInMessage;
  message: string | undefined;
  cause: Error | string | undefined;
}) => string;

const generateMessage: GenerateMessage = ({
  message,
  causeInMessage,
  cause,
}) => {
  if (!cause || causeInMessage === "ignore") {
    return message ?? "";
  }

  if (!message || causeInMessage === "replace") {
    return String(cause);
  }

  return message + ". Due to: " + cause;
};

class AnimateMapError extends Error {
  readonly where?: string;
  readonly args?: unknown;
  readonly cause?: unknown;
  readonly consoleLevel?: ConsoleLevel;

  constructor(
    name?: string,
    {
      args,
      cause,
      message,
      where,
      causeInMessage = "append",
      consoleLevel = "warn",
    }: AnimateMapErrorOptions = {}
  ) {
    super(generateMessage({ causeInMessage, message, cause }));
    this.name = name || "SparkleError";
    this.where = where;
    this.args = args;
    this.cause = cause;
    this.consoleLevel = consoleLevel;
  }
}

export class AnimateMapQueryError extends AnimateMapError {
  constructor(options?: AnimateMapErrorOptions) {
    super("SparkleQueryError", options);
  }
}
