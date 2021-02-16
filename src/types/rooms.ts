export interface BaseRoom {
  about: string;
  subtitle: string;
  title: string;
  url: string;
}

export interface Room extends BaseRoom {
  attendanceBoost?: number;
  height_percent: number;
  image_url: string;
  isEnabled: boolean;
  width_percent: number;
  x_percent: number;
  y_percent: number;
}

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
}
