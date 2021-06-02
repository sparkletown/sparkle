const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");

exports.setVideoChatState = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const { videoChatId, state } = data;

  return admin
    .firestore()
    .collection("videoRooms")
    .doc(videoChatId)
    .update({ state });
});

exports.acceptVideoRoomRequest = functions.https.onCall(
  async (data, context) => {
    checkAuth(context);

    const { videoChatId, state, invitedUserLocation } = data;

    return admin
      .firestore()
      .collection("videoRooms")
      .doc(videoChatId)
      .update({ state, invitedUserLocation });
  }
);

exports.addVideoRoomRequest = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const videoRoomRequest = data.videoRoomRequest;

  return admin
    .firestore()
    .collection("videoRooms")
    .add(videoRoomRequest)
    .then((response) => response.id);
});
