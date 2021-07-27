import * as admin from "firebase-admin";

// re-export type definitions to decrease declaration verbosity in other files
// and for some reason, ESLint thinks they're unused, thus the disable comments
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import CollectionReference = admin.firestore.CollectionReference;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DocumentData = admin.firestore.DocumentData;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DocumentReference = admin.firestore.DocumentReference;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DocumentSnapshot = admin.firestore.DocumentSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Timestamp = admin.firestore.Timestamp;

export type SimulationName = "chat" | "experience" | "seat";

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

  reactions: number;
  reactionsRemoved: number;

  chatlines: number;
  chatlinesRemoved: number;
}>;

export type SimLoopConfig = {
  chunkSize: number;
  tick: number;
  affinity: number;
};

export type HasCleanupFlag = {
  cleanup: boolean;
};

export type SimConfig = Partial<
  SimLoopConfig & {
    projectId: string;
    credentials: string;

    simulate: SimulationName[];

    log: Partial<{
      verbose: boolean;
      stack: boolean;
    }>;

    user: Partial<
      HasCleanupFlag & {
        scriptTag: string;
        count: number;
      }
    >;

    venue: Partial<{
      id: string;
      minRow: number;
      minCol: number;
      maxRow: number;
      maxCol: number;
      chunkSize: number;
    }>;

    seat: Partial<SimLoopConfig>;
    chat: Partial<SimLoopConfig & HasCleanupFlag>;
    experience: Partial<SimLoopConfig & HasCleanupFlag>;
  }
>;
