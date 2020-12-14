export type RoomEventData = RoomEvent[];

export type RoomEvent = {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
};
