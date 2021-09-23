import { User } from "types/User";

import { WithId } from "utils/id";

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
  tableLocked: (table: string) => boolean;
  experienceName: string;
  users: readonly WithId<User>[];
  tableCapacity?: number;
  onJoinClicked: (table: string, locked: boolean) => void;
  imageSize?: number;
}
