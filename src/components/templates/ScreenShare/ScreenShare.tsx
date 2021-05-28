import React from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import useAgoraScreenShare from "./useAgoraScreenShare";
import Player from "./components/Player/Player";
import useAgoraCamera from "./useAgoraCamera";
import "./ScreenShare.scss";

const screenClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const cameraClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

export const ScreenShare = () => {
  const {
    localCameraTrack,
    remoteUsers,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
  } = useAgoraCamera(cameraClient);

  const { localScreenTrack, shareScreen, stopShare } = useAgoraScreenShare(
    screenClient
  );

  return (
    <div className="ScreenShare">
      <div className="ScreenShare__scene">
        <div className="ScreenShare__scene--players">
          {localCameraTrack && isCameraOn && (
            <div>
              <Player videoTrack={localCameraTrack} />
            </div>
          )}
          {localScreenTrack && (
            <div>
              <Player videoTrack={localScreenTrack} />
            </div>
          )}
          {remoteUsers.map(
            (user) =>
              user.uid !== screenClient.uid && (
                <div key={user.uid}>
                  <Player
                    videoTrack={user.videoTrack}
                    audioTrack={user.audioTrack}
                  />
                </div>
              )
          )}
        </div>

        <div className="ScreenShare__buttons">
          <button
            className="btn btn-small"
            onClick={() => {
              localScreenTrack ? stopShare() : shareScreen();
            }}
          >
            {localScreenTrack ? "Stop share" : "Share"}
          </button>
          <button
            className="btn btn-small"
            onClick={() => {
              toggleMicrophone();
              toggleCamera();
            }}
          >
            Toggle camera and microphone
          </button>
        </div>
      </div>
    </div>
  );
};
