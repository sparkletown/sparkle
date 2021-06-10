import React, { FC, useCallback, useEffect, useMemo } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { FullTalkShowVenue } from "types/venues";
import { WithId } from "utils/id";
import useAgoraScreenShare from "./agoraHooks/useAgoraScreenShare";
import Player from "./components/Player/Player";
import useAgoraCamera from "./agoraHooks/useAgoraCamera";
import useAgoraRemotes from "./agoraHooks/useAgoraRemotes";
import Audience from "./components/Audience/Audience";
import SettingsSidebar from "./components/SettingsSidebar/SettingsSidebar";
import useStage from "./useStage";
import AppButton from "../../atoms/Button";
import { ControlBar } from "./components/ControlBar";
import { AgoraClientConnectionState } from "../../../types/agora";
import { useSelector } from "../../../hooks/useSelector";
import { currentVenueSelectorData } from "../../../utils/selectors";
import { useUser } from "../../../hooks/useUser";
import "./ScreenShare.scss";

const AGORA_CHANNEL = {
  appId: "bc9f5ed85b4f4218bff32c78a3ff88eb",
  channel: "videotest",
  token: null,
};

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

export interface ScreenShareProps {
  venue: WithId<FullTalkShowVenue>;
}

export const ScreenShare: FC<ScreenShareProps> = ({ venue }) => {
  const { userId } = useUser();

  const isRequestToJoinStageEnabled = useMemo(() => venue.requestToJoinStage, [
    venue.requestToJoinStage,
  ]);

  const currentVenue = useSelector(currentVenueSelectorData);
  const isUserOwner = useMemo(
    () => !!userId && currentVenue?.owners.includes(userId),
    [currentVenue?.owners, userId]
  );

  const remoteUsers = useAgoraRemotes(remotesClient, AGORA_CHANNEL);

  const {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinChannel: cameraClientJoin,
    leaveChannel: cameraClientLeave,
  } = useAgoraCamera(cameraClient);

  const {
    localScreenTrack,
    shareScreen,
    stopShare,
    joinChannel: screenClientJoin,
    leaveChannel: screenClientLeave,
  } = useAgoraScreenShare(screenClient);

  const {
    joinStage,
    leaveStage,
    requestJoinStage,
    canJoinStage,
    isUserOnStage,
  } = useStage();

  const onStageJoin = useCallback(() => {
    cameraClientJoin(
      AGORA_CHANNEL.appId,
      AGORA_CHANNEL.channel,
      AGORA_CHANNEL.token
    );
    screenClientJoin(
      AGORA_CHANNEL.appId,
      AGORA_CHANNEL.channel,
      AGORA_CHANNEL.token
    );
    joinStage();
  }, [cameraClientJoin, joinStage, screenClientJoin]);

  const onStageLeaving = useCallback(() => {
    cameraClientLeave();
    screenClientLeave();
    leaveStage();
  }, [cameraClientLeave, leaveStage, screenClientLeave]);

  useEffect(() => {
    cameraClient.connectionState === AgoraClientConnectionState.DISCONNECTED &&
      isUserOnStage &&
      onStageJoin();

    cameraClient.connectionState === AgoraClientConnectionState.CONNECTED &&
      !isUserOnStage &&
      onStageLeaving();
  }, [isUserOnStage, onStageJoin, onStageLeaving]);

  return (
    <>
      <div className="ScreenShare">
        <div className="ScreenShare__scene">
          {localScreenTrack && (
            <div className="ScreenShare__scene--sharing">
              <Player
                videoTrack={localScreenTrack}
                containerClass="ScreenShare__mode--share"
              />
            </div>
          )}
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
                  containerClass="ScreenShare__mode--play"
                />
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
                        containerClass="ScreenShare__mode--play"
                      />
                    )}
                  </div>
                )
            )}
          </div>

          <ControlBar
            isSharing={!!localScreenTrack}
            loading={
              screenClient.connectionState !==
              AgoraClientConnectionState.CONNECTED
            }
            onStageJoin={onStageJoin}
            onStageLeaving={onStageLeaving}
            shareScreen={shareScreen}
            stopShare={stopShare}
            showJoinStageButton={isUserOwner}
          />
        </div>
        {isRequestToJoinStageEnabled && canJoinStage && !isUserOwner && (
          <AppButton
            onClick={() => {
              requestJoinStage();
            }}
          >
            <span>✋</span> Request to join
          </AppButton>
        )}
        <Audience venue={venue} />
      </div>
      <SettingsSidebar venue={venue} />
    </>
  );
};
