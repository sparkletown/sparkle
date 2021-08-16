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
export type SimulationName = "chat" | "experience" | "seat" | "table";

export type RunContext<T> = {
  conf: T;
  log: LogFunction;
  stats: SimStats;
  stop: Promise<StopSignal>;
};

export interface RunTime {
  start: string;
  finish: string;
  run: string;
}

export interface ScriptRunTime extends RunTime {
  init: string;
  cleanup: string;
}

export interface SimAverages {
  chatlines: string;
  reactions: string;
  writes: string;
  relocations: string;
}

export type SimStats = Incomplete<{
  script: ScriptRunTime;
  sim: RunTime;

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

  average: Record<string, SimAverages>;
}>;

export type SimLoopConfig = {
  affinity: number;
  chunkSize: number;
  tick: number;
};

export type HasCleanupFlag = { cleanup: boolean };
export type HasImpatienceFlag = { impatience: boolean };

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
    };

    seat: SimLoopConfig & HasImpatienceFlag;
    table: SimLoopConfig & HasImpatienceFlag;
    chat: SimLoopConfig & HasCleanupFlag;
    experience: SimLoopConfig & HasCleanupFlag;
  }
>;

// NOTE: local utility type for defining SimContext, use that one instead
type FullSimContext = RunContext<SimConfig> & {
  chatsRef: CollectionReference;
  reactionsRef: CollectionReference;
  template: string;
  userRefs: DocumentReference[];
  venueId: string;
  venueName: string;
  venueRef: DocumentReference;
};

export type SimContext<
  T extends keyof FullSimContext = keyof FullSimContext
> = Pick<FullSimContext, T>;

export type GridSize = {
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
};

export type TableInfo = {
  cap: number;
  col: number;
  dub: string;
  idx: string;
  row: number;
  ref: string;
};
