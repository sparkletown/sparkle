export enum RoomTypes {
  unclickable = "UNCLICKABLE",
}

// @debt We should end up with 1 canonical room type
export interface Room {
  type?: RoomTypes;
  title: string;
  subtitle: string;
  url: string;
  about: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  isEnabled: boolean;
  image_url: string;
  // Legacy?
  attendanceBoost?: number;
}

// @debt We should end up with 1 canonical room type
export interface RoomData_v2 {
  type?: RoomTypes;
  title?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  x_percent?: number;
  y_percent?: number;
  width_percent?: number;
  height_percent?: number;
  isEnabled?: boolean;
  template?: string;
  image_url?: string;
  roomIndex?: number;
}
