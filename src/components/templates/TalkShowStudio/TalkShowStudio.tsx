import React, { FC, useCallback, useEffect, useMemo } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

import { WithId } from "utils/id";
import { useStage } from "./useStage";
import { FullTalkShowVenue } from "types/venues";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { AgoraClientConnectionState } from "types/agora";
import {
  useAgoraCamera,
  useAgoraRemotes,
  useAgoraScreenShare,
} from "hooks/video/agora";

import AppButton from "components/atoms/Button";
import Player, { VideoPlayerProps } from "./components/Player/Player";
import { ControlBar } from "./components/ControlBar";
import Audience from "./components/Audience/Audience";
import { currentVenueSelectorData } from "utils/selectors";
import SettingsSidebar from "./components/SettingsSidebar/SettingsSidebar";

import "./TalkShowStudio.scss";

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

export interface TalkShowStudioProps {
  venue: WithId<FullTalkShowVenue>;
}

export const TalkShowStudio: FC<TalkShowStudioProps> = ({ venue }) => {
  const stage = useStage();
  const { userId, profile } = useUser();
  const currentVenue = useSelector(currentVenueSelectorData);
  const remoteUsers = useAgoraRemotes({ client: remotesClient });
  const isRequestToJoinStageEnabled = venue.requestToJoinStage;

  const {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinChannel: cameraClientJoin,
    leaveChannel: cameraClientLeave,
  } = useAgoraCamera({ client: cameraClient });

  const {
    localScreenTrack,
    shareScreen,
    stopShare,
    joinChannel: screenClientJoin,
    leaveChannel: screenClientLeave,
  } = useAgoraScreenShare({ client: screenClient });

  const [localUser] = useMemo(
    () => stage.peopleOnStage.filter(({ id }) => id === userId),
    [userId, stage.peopleOnStage]
  );

  const isUserOwner = useMemo(
    () => !!userId && currentVenue?.owners.includes(userId),
    [currentVenue?.owners, userId]
  );

  const [userOnStageSharingScreen] = useMemo(
    () =>
      stage.peopleOnStage.filter(
        ({ data }) => data?.[`${venue.id}`]?.isSharingScreen
      ),
    [stage.peopleOnStage, venue.id]
  );
  const [remoteScreenTrack] = useMemo(
    () =>
      remoteUsers.filter(
        ({ uid }) =>
          `${uid}` ===
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.screenClientUid
      ),
    [userOnStageSharingScreen?.data, remoteUsers, venue.id]
  );
  const [remoteCameraTrack] = useMemo(
    () =>
      remoteUsers.filter(
        ({ uid }) =>
          `${uid}` ===
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.cameraClientUid
      ),
    [userOnStageSharingScreen?.data, remoteUsers, venue.id]
  );

  const remoteUsersPlayers = useMemo(() => {
    const setRemoteUserAvatar = (remoteUserId: number | string) => {
      if (!venue.id) return;
      const [remoteUser] = stage.peopleOnStage.filter(
        ({ data }) =>
          data?.[`${venue.id}`]?.cameraClientUid === `${remoteUserId}`
      );
      return remoteUser;
    };
    return remoteUsers
      .filter(
        ({ uid }) =>
          `${uid}` !==
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.cameraClientUid
      )
      .filter(
        ({ uid }) =>
          `${uid}` !==
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.screenClientUid
      )
      .map(
        (user) =>
          user.uid !== screenClient.uid &&
          user.uid !== cameraClient.uid && (
            <div key={user.uid}>
              {user.hasVideo && (
                <Player
                  user={setRemoteUserAvatar(user.uid)}
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                  containerClass="TalkShowStudio__mode--play"
                />
              )}
            </div>
          )
      );
  }, [remoteUsers, venue.id, stage.peopleOnStage, userOnStageSharingScreen]);
  console.log(remoteUsers, stage.peopleOnStage);
  const onStageJoin = useCallback(() => {
    cameraClientJoin();
    screenClientJoin();
    stage.joinStage();
  }, [cameraClientJoin, stage, screenClientJoin]);

  const onStageLeaving = useCallback(() => {
    cameraClientLeave();
    screenClientLeave();
    stage.leaveStage();
  }, [cameraClientLeave, stage, screenClientLeave]);

  useEffect(() => {
    cameraClient.connectionState === AgoraClientConnectionState.DISCONNECTED &&
      stage.isUserOnStage &&
      onStageJoin();

    cameraClient.connectionState === AgoraClientConnectionState.CONNECTED &&
      !stage.isUserOnStage &&
      onStageLeaving();
  }, [stage.isUserOnStage, onStageJoin, onStageLeaving]);

  useEffect(() => {
    !stage.isUserSharing && localScreenTrack && stopShare();
  }, [stage.isUserSharing, localScreenTrack, stopShare]);

  useEffect(() => {
    const isUserMuted = profile?.data?.[venue.id]?.isMuted;

    if ((isUserMuted && isMicrophoneOn) || !(isUserMuted || isMicrophoneOn)) {
      toggleMicrophone();
    }
  }, [isMicrophoneOn, profile?.data, toggleMicrophone, venue.id]);

  const isJoinStageButtonDisplayed =
    isRequestToJoinStageEnabled &&
    stage.canJoinStage &&
    !isUserOwner &&
    !stage.isUserOnStage &&
    !stage.isUserRequesting;

  const renderScreenSharing = (
    screenTrack: VideoPlayerProps["videoTrack"],
    cameraTrack: VideoPlayerProps["videoTrack"]
  ) => {
    if (!screenTrack || !cameraTrack) return;
    return (
      <div className="TalkShowStudio__scene--sharing">
        {screenTrack && (
          <Player
            videoTrack={screenTrack}
            containerClass="TalkShowStudio__mode--share"
          />
        )}
        {cameraTrack && (
          <Player
            user={localUser}
            videoTrack={cameraTrack}
            showButtons
            isCamOn={isCameraOn}
            isMicOn={isMicrophoneOn}
            isSharing={!!screenTrack}
            toggleCam={toggleCamera}
            toggleMic={toggleMicrophone}
            containerClass="TalkShowStudio__mode--local-play"
          />
        )}
      </div>
    );
  };
  console.log("remoteScreenTrack", remoteScreenTrack);
  console.log("remoteCameraTrack", remoteCameraTrack);

  return (
    <>
      <div className="TalkShowStudio">
        <div className="TalkShowStudio__scene">
          {renderScreenSharing(
            localScreenTrack || remoteScreenTrack?.videoTrack,
            localCameraTrack || remoteCameraTrack?.videoTrack
          )}
          <div className="TalkShowStudio__players">
            {localCameraTrack && !localScreenTrack && (
              <div>
                <Player
                  user={localUser}
                  videoTrack={localCameraTrack}
                  showButtons
                  isCamOn={isCameraOn}
                  isMicOn={isMicrophoneOn}
                  isSharing={!!localScreenTrack}
                  toggleCam={toggleCamera}
                  toggleMic={stage.toggleMute}
                  containerClass="TalkShowStudio__mode--play"
                />
              </div>
            )}
            {remoteUsersPlayers}
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
        {isJoinStageButtonDisplayed && (
          <AppButton
            customClass="TalkShowStudio__request-button"
            onClick={stage.requestJoinStage}
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
