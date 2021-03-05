export enum RoomTypes {
  unclickable = "UNCLICKABLE",
}

// @debt We should end up with 1 canonical room type
export interface Room {
  about: string;
  subtitle: string;
  title: string;
  url: string;
  height_percent: number;
  image_url: string;
  isEnabled: boolean;
  width_percent: number;
  x_percent: number;
  y_percent: number;
  attendanceBoost?: number;
  type?: RoomTypes;
}

// @debt We should end up with 1 canonical room type
export interface RoomData_v2 {
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
  type?: RoomTypes;
}
