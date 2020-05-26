import firebase from 'firebase/app';

export const PREVIEW_ROOM = 'PREVIEW_ROOM';
export const EXIT_PREVIEW_ROOM = 'EXIT_PREVIEW_ROOM';
export const TIMER_STARTED = 'TIMER_STARTED';
export const TIMER_STOPPED = 'TIMER_STOPPED';
export const TIMER_TICK = 'TIMER_TICK';
export const SET_USER = 'SET_USER';

function sendRoom(room, uid) {
  const firestore = firebase.firestore();
  const doc = `users/${uid}`;
  const update = {room: room ? room.name : null};
  firestore
    .doc(doc)
    .update(update)
    .catch(e => {
      firestore
        .doc(doc)
        .set(update);
    });
}

export function sendChat(name, text) {
  return dispatch => {
    const firestore = firebase.firestore();
    firestore
      .collection('chats')
      .add({
        ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
        name,
        text,
    });
  }
}

export function previewRoom(room) {
  return { type: PREVIEW_ROOM, room };
}

export function exitPreviewRoom(uid) {
  return dispatch => {
    dispatch({ type: EXIT_PREVIEW_ROOM });
    dispatch(leaveRoom(uid));
  };
}

export function enterRoom(room, uid) {
  return dispatch => {
    sendRoom(room, uid);
  };
}

export function leaveRoom(uid) {
  return dispatch => {
    sendRoom(null, uid);
  };
}

export function timerStarted(interval) {
  return { type: TIMER_STARTED, interval };
}

export function startTimer() {
  return dispatch => {
    const interval = setInterval(() => dispatch(timerTick(Date.now() / 1000)), 1000);
    dispatch(timerStarted(interval));
  };
}

export function timerStopped() {
  return { type: TIMER_STOPPED };
}

export function stopTimer(interval) {
  return dispatch => {
    clearInterval(interval);
    dispatch(timerStopped());
  }
}

export function timerTick(time) {
  return { type: TIMER_TICK, time };
}

export function setUser(user) {
  return { type: SET_USER, user };
}

export function updateProfile(user, values) {
  return dispatch => {
    user.updateProfile(values).then(() => {
      dispatch(setUser({...user}));
    });
  };
}