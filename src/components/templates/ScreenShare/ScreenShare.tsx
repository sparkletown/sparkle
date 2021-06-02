import React, { useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import useAgoraScreenShare from "./agoraHooks/useAgoraScreenShare";
import Player from "./components/Player/Player";
import useAgoraCamera from "./agoraHooks/useAgoraCamera";
import "./ScreenShare.scss";
import useAgoraRemotes from "./agoraHooks/useAgoraRemotes";
import Audience from "./components/Audience/Audience";
import Button from "./components/Button/Button";
import LeaveStageModal from "./components/LeaveStageModal/LeaveStageModal";

const remotesClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const screenClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const cameraClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

export const ScreenShare = () => {
  const [openLeaveStageModal, setOpenLeaveStageModal] = useState(false);
  const remoteUsers = useAgoraRemotes(remotesClient);

  const {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    closeTracks,
  } = useAgoraCamera(cameraClient);

  const { localScreenTrack, shareScreen, stopShare } = useAgoraScreenShare(
    screenClient
  );

  return (
    <div className="ScreenShare">
      <div className="ScreenShare__scene">
        <div className="ScreenShare__scene--players">
          {localCameraTrack && (
            <div>
              <Player
                videoTrack={localCameraTrack}
                showButtons
                isCamOn={isCameraOn}
                isMicOn={isMicrophoneOn}
                isSharing={!!localScreenTrack}
                toggleCam={toggleCamera}
                toggleMic={toggleMicrophone}
              />
            </div>
          )}
          {localScreenTrack && (
            <div>
              <Player videoTrack={localScreenTrack} />
            </div>
          )}
          {remoteUsers.map(
            (user) =>
              user.uid !== screenClient.uid &&
              user.uid !== cameraClient.uid && (
                <div key={user.uid}>
                  {user.hasVideo && (
                    <Player
                      videoTrack={user.videoTrack}
                      audioTrack={user.audioTrack}
                    />
                  )}
                </div>
              )
          )}
        </div>

        <div className="ScreenShare__buttons">
          <Button
            onClick={() => {
              localScreenTrack ? stopShare() : shareScreen();
            }}
            rightLabel={localScreenTrack && "You are screensharing"}
            variant="secondary"
            small
          >
            {localScreenTrack ? "Stop Sharing" : "Share Screen"}
          </Button>

          <Button
            onClick={() => {
              setOpenLeaveStageModal(true);
            }}
            leftLabel="You are on stage"
            variant="secondary"
            small
          >
            Leave stage
          </Button>
        </div>
      </div>
      <Audience />
      <LeaveStageModal
        show={openLeaveStageModal}
        onHide={() => {
          setOpenLeaveStageModal(false);
        }}
        onSubmit={() => {
          // host -> audience
          closeTracks();
          stopShare();
        }}
      />
    </div>
  );
};
