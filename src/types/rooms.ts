export type AnyRoom = PartyMapRoom | AvatarGridRoom;

export interface BaseRoom {
  about: string;
  subtitle: string;
  title: string;
  url: string;
}

// TODO: most of our usage across the codebase uses PartyMapRoom, not Room.
//  We should refactor usages of Room, then rename this to Room. I don't believe
//  there is any valid reason why we need both types to exist.
// @debt should this extend from/be merged with Rooms?
export interface PartyMapRoom extends BaseRoom {
  attendanceBoost?: number;
  height_percent: number;
  image_url: string;
  isEnabled: boolean;
  width_percent: number;
  x_percent: number;
  y_percent: number;
}

export interface AvatarGridRoom {
  row: number;
  column: number;
  width: number;
  height: number;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  isFull: boolean;
}
