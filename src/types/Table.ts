import { User } from "types/User";

export interface Table {
  title?: string;
  subtitle?: string;
  capacity?: number;
  columns?: string;
  rows?: string;
  reference: string;
}

export interface TableComponentPropsType {
  table: Table;
  tableLocked: (table: string) => boolean;
  experienceName: string;
  users: User[];
  setSelectedUserProfile: (user: User) => void;
  tableCapacity?: number;
  onJoinClicked: (table: string, locked: boolean, videoRoom: string) => void;
  nameOfVideoRoom: string;
  imageSize?: number;
}
