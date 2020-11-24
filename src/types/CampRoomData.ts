// @debt should this extend from RoomData?
export interface CampRoomData {
  title: string;
  subtitle: string;
  about: string;
  image_url: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  url: string;
  isEnabled: boolean;
  attendanceBoost?: number;
}
