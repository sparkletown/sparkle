import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { AnyVenue } from "./venues";

export interface Table {
  title: string;
  subtitle?: string;
  capacity?: number;
  columns?: number;
  rows?: number;
  reference: string;
  locked?: boolean;
}

export interface TableComponentPropsType {
  table: Table;
  userId: string;
  tableLocked: (table: string) => boolean;
  users: readonly WithId<DisplayUser>[];
  tableCapacity?: number;
  onJoinClicked: (table: string, locked: boolean) => void;
  space: WithId<AnyVenue>;
}
