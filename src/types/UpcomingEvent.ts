import type firebase from "firebase/compat/app";

export interface UpcomingEvent {
  ts_utc: firebase.firestore.Timestamp;
  url: string;
  name: string;
}
