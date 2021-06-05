export interface UpcomingEvent {
  start_utc_seconds: number;
  ts_utc: firebase.firestore.Timestamp;
  url: string;
  name: string;
}
