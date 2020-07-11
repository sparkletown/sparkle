export interface UpcomingEvent {
  ts_utc: firebase.firestore.Timestamp;
  url: string;
  name: string;
}
