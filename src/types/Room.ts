export interface Event {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
}

export interface Room {
  title: string;
  subtitle: string;
  on_list: boolean;
  on_map: boolean;
  image: string;
  url: string;
  path: string;
  events?: Event[];
  attendance_x?: number;
  attendance_y?: number;
  button_text?: string;
  external_url?: string;
}
