import * as admin from "firebase-admin";

// re-export type definitions to decrease declaration verbosity in other files
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
  reactionsRemoved: number;
  relocations: number;
  reactions: number;
}>;

export type SimLoopConfig = {
  chunkSize: number;
  tick: number;
  affinity: number;
};

export type SimConfig = Partial<
  SimLoopConfig & {
    projectId: string;
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

    seat: Partial<SimLoopConfig>;
    chat: Partial<SimLoopConfig>;
    experience: Partial<
      SimLoopConfig & {
        cleanup: boolean;
      }
    >;

    log: Partial<{
      verbose: boolean;
      stack: boolean;
    }>;
  }
>;
