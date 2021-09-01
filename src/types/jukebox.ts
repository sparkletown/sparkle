import firebase from "firebase/app";

export type JukeboxMessage = {
  from: string;
  text: string;
  url: string;
  tableId: string;
  ts_utc: firebase.firestore.Timestamp;
};

export interface SendMessageProps {
  message: string;
  url: string;
}

export type SendJukeboxMessage = (
  sendMessageProps: SendMessageProps
) => Promise<void> | undefined;
