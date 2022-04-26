import * as admin from "firebase-admin";

import { FetchSovereignVenueReturn } from "./fetch";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,no-undef
export import WriteBatch = admin.firestore.WriteBatch;

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

    venue: GridSize & {
      id: string;
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
  usersById: Record<string, WithId<BotUser>>;
  venueId: string;
  venueName: string;
  venueRef: DocumentReference;
  sovereignVenue: FetchSovereignVenueReturn;
};

export type SimContext<
  T extends keyof FullSimContext = keyof FullSimContext
> = Pick<FullSimContext, T>;

export type GridSize = {
  auditoriumColumns: number;
  auditoriumRows: number;
};

export type GridPosition = {
  row: number;
  col: number;
};

export type Grid = string[][];

export type SectionGridPosition = GridPosition & {
  sectionId: string;
};

export type SeatedUsersMap = Partial<Record<string, SectionGridPosition>>;

export type TableInfo = GridPosition & {
  cap: number;
  dub: string;
  idx: string;
  ref: string;
};

export type WithId<T extends object> = T & { id: string };

export interface TruncatedVenueType {
  parentId?: string;
  name: string;
  host?: {
    icon: string;
  };
  owners: string[];
  iframeUrl?: string;
  autoPlay?: boolean;
  zoomUrl?: string;
  mapBackgroundImageUrl?: string;
  placementRequests?: string;
  radioStations?: string[];
  radioTitle?: string;
  dustStorm?: boolean;
  activity?: string;
  bannerMessage?: string;
  miniAvatars?: boolean;
  samlAuthProviderId?: string;
  showAddress?: boolean;
  showGiftATicket?: boolean;
  columns?: number;
  rows?: number;
  nightCycle?: boolean;
  hasPaidEvents?: boolean;
  profileAvatars?: boolean;
  showGrid?: boolean;
  width: number;
  height: number;
  description?: {
    text: string;
  };
  showLearnMoreLink?: boolean;
  start_utc_seconds?: number;
  end_utc_seconds?: number;
  ticketUrl?: string;
  showReactions?: boolean;
  showShoutouts?: boolean;
  auditoriumColumns?: number;
  auditoriumRows?: number;
  showRadio?: boolean;
  showUserStatus?: boolean;
  createdAt?: number;
  recentUserCount?: number;
  recentUsersSampleSize?: number;
  updatedAt?: number;
  worldId: string;
}

export type BotUser = {
  partyName: string;
  pictureUrl: string;
  bot: true;
  botUserScriptTag: string;
};
