import * as admin from "firebase-admin";

// re-export type definitions to decrease declaration verbosity in other files
// and for some reason, ESLint thinks they're unused, thus the disable comments
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import CollectionReference = admin.firestore.CollectionReference;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import DocumentData = admin.firestore.DocumentData;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import DocumentReference = admin.firestore.DocumentReference;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import DocumentSnapshot = admin.firestore.DocumentSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import Timestamp = admin.firestore.Timestamp;

export type LogFunction = typeof console.log;

export type Incomplete<T> = {
  [K in keyof T]?: T[K] extends object ? Incomplete<T[K]> : T[K];
};

export type StopSignal = "sigint" | "timeout";
export type SimulationName = "chat" | "experience" | "seat";

export type SimStats = Incomplete<{
  time: {
    start: string;
    finish: string;
    run: string;
  };

  file: {
    configuration: string;
    credentials: string;
  };

  users: {
    count: number;
    updated: number;
    created: number;
    removed: number;
  };

  relocations: number;

  reactions: {
    created: number;
    removed: number;
  };

  chatlines: {
    created: number;
    removed: number;
  };

  entered: number;
  writes: number;

  average: Record<string, unknown>;
}>;

export type SimLoopConfig = {
  chunkSize: number;
  tick: number;
  affinity: number;
};

export type HasCleanupFlag = {
  cleanup: boolean;
};

export type SimConfig = Incomplete<
  SimLoopConfig & {
    projectId: string;
    credentials: string;

    timeout: number;
    keepAlive: boolean;
    simulate: SimulationName[];

    log: {
      verbose: boolean;
      stack: boolean;
    };

    user: HasCleanupFlag & {
      count: number;
      createMissing: boolean;
      scriptTag: string;
    };

    venue: {
      id: string;
      minRow: number;
      minCol: number;
      maxRow: number;
      maxCol: number;
      chunkSize: number;
    };

    seat: SimLoopConfig & { impatience: boolean };
    chat: SimLoopConfig & HasCleanupFlag;
    experience: SimLoopConfig & HasCleanupFlag;
  }
>;

export type RunContext<T> = {
  conf: T;
  log: LogFunction;
  stats: SimStats;
  stop: Promise<StopSignal>;
};

export type GridSize = {
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
};
