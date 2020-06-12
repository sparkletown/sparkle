import firebase from "firebase/app";

export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
export const SET_USER = "SET_USER";

function sendRoom(room, uid) {
  const firestore = firebase.firestore();
  const doc = `users/${uid}`;
  const update = { room: room ? room.title : null };
  firestore
    .doc(doc)
    .update(update)
    .catch((e) => {
      firestore.doc(doc).set(update);
    });
}

export function sendChat(senderName, senderId, text) {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore.collection("chatsv2").add({
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
      senderName,
      text,
      senderId,
    });
  };
}

export function sendPrivateChat(senderName, senderId, recipientId, text) {
  return (dispatch) => {
    const firestore = firebase.firestore();
    firestore.collection("chatsv2").add({
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
      senderName,
      text,
      senderId,
      recipientId,
    });
  };
}

export function previewRoom(room) {
  return { type: PREVIEW_ROOM, room };
}

export function exitPreviewRoom(uid) {
  return (dispatch) => {
    dispatch({ type: EXIT_PREVIEW_ROOM });
    dispatch(leaveRoom(uid));
  };
}

export function enterRoom(room, uid) {
  return (dispatch) => {
    sendRoom(room, uid);
  };
}

export function leaveRoom(uid) {
  return (dispatch) => {
    sendRoom(null, uid);
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
