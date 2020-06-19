import firebase from "firebase/app";

import { leaveRoom } from "utils/useLocationUpdateEffect";

export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
export const SET_USER = "SET_USER";

export function sendGlobalChat(from, text) {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore.collection("chatsv3").add({
      type: "global",
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
      text,
      from,
    });
  };
}

export const sendRoomChat = (from, to, text) => {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore.collection("chatsv3").add({
      type: "room",
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
      text,
      from,
      to,
    });
  };
};

export function sendPrivateChat(from, to, text) {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore
      .collection("privatechats")
      .doc(from)
      .collection("chats")
      .add({
        type: "private",
        ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
        text,
        from,
        to,
      });
    firestore
      .collection("privatechats")
      .doc(to)
      .collection("chats")
      .add({
        type: "private",
        ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
        text,
        from,
        to,
      });
  };
}

export function sendTableChat(from, to, text) {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore.collection("chatsv3").add({
      type: "table",
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
      text,
      from,
      to,
    });
  };
}

export function previewRoom(room) {
  return { type: PREVIEW_ROOM, room };
}

export function exitPreviewRoom(user) {
  return (dispatch) => {
    dispatch({ type: EXIT_PREVIEW_ROOM });
    leaveRoom(user);
  };
}

export function setUser(user) {
  return { type: SET_USER, user };
}

export function updateProfile(user, values) {
  return (dispatch) => {
    user.updateProfile(values).then(() => {
      dispatch(setUser({ ...user }));
    });
  };
}
