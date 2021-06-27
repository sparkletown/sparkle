import React, { FC, useCallback, useEffect, useMemo } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

import { FullTalkShowVenue } from "types/venues";
import { AgoraClientConnectionState } from "types/agora";

import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import {
  useAgoraCamera,
  useAgoraRemotes,
  useAgoraScreenShare,
} from "hooks/video/agora";

import { useStage } from "./useStage";
import AppButton from "components/atoms/Button";
import { Player, VideoPlayerProps } from "./components/Player/Player";
import { ControlBar } from "./components/ControlBar";
import Audience from "./components/Audience/Audience";
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

  const localUser = useMemo(
    () => stage.peopleOnStage.find(({ id }) => id === userId),
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
  const remoteScreenTrack = useMemo(
    () =>
      remoteUsers.find(
        ({ uid }) =>
          `${uid}` ===
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.screenClientUid
      ),
    [userOnStageSharingScreen?.data, remoteUsers, venue.id]
  );

  const remoteUsersPlayers = useMemo(() => {
    const uniqueUsersIds = new Set();
    const setRemoteUserAvatar = (remoteUserId: number | string) => {
      if (!venue.id) return;

      return stage.peopleOnStage.find(
        ({ data }) =>
          data?.[`${venue.id}`]?.cameraClientUid === `${remoteUserId}`
      );
    };

    return remoteUsers.map((agoraRemoteUser) => {
      const user = setRemoteUserAvatar(agoraRemoteUser.uid);
      if (!user) return null;

      const isUniqueUser = !uniqueUsersIds.has(user.id);
      if (isUniqueUser) {
        uniqueUsersIds.add(user.id);
      }

      return (
        agoraRemoteUser.uid !== screenClient.uid &&
        agoraRemoteUser.uid !== cameraClient.uid && (
          <div key={agoraRemoteUser.uid}>
            {isUniqueUser && (
              <Player
                showButtons
                user={setRemoteUserAvatar(agoraRemoteUser.uid)}
                videoTrack={agoraRemoteUser.videoTrack}
                audioTrack={agoraRemoteUser.audioTrack}
                isCamOn={agoraRemoteUser.hasVideo}
                isMicOn={agoraRemoteUser.hasAudio}
                toggleCam={isUserOwner ? stage.toggleUserCamera : undefined}
                toggleMic={isUserOwner ? stage.toggleUserMicrophone : undefined}
                containerClass="TalkShowStudio__mode--play"
              />
            )}
          </div>
        )
      );
    });
  }, [
    isUserOwner,
    remoteUsers,
    venue.id,
    stage.peopleOnStage,
    stage.toggleUserCamera,
    stage.toggleUserMicrophone,
  ]);

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
    const isUserMicOff = profile?.data?.[venue.id]?.isMuted;

    if ((isUserMicOff && isMicrophoneOn) || !(isUserMicOff || isMicrophoneOn)) {
      toggleMicrophone();
    }
  }, [isMicrophoneOn, profile?.data, toggleMicrophone, venue.id]);

  useEffect(() => {
    const isUserCameraOff = profile?.data?.[venue.id]?.isUserCameraOff;

    if ((isUserCameraOff && isCameraOn) || !(isUserCameraOff || isCameraOn)) {
      toggleCamera();
    }
  }, [isCameraOn, profile?.data, toggleCamera, venue.id]);

  const isJoinStageButtonDisplayed =
    isRequestToJoinStageEnabled &&
    stage.canJoinStage &&
    !isUserOwner &&
    !stage.isUserOnStage &&
    !stage.isUserRequesting;

  const renderScreenSharing = (screenTrack: VideoPlayerProps["videoTrack"]) =>
    screenTrack && (
      <div className="TalkShowStudio__scene--sharing">
        <Player
          videoTrack={screenTrack}
          containerClass="TalkShowStudio__mode--share"
        />
      </div>
    );

  return (
    <>
      <div className="TalkShowStudio">
        <div className="TalkShowStudio__scene">
          {renderScreenSharing(
            localScreenTrack || remoteScreenTrack?.videoTrack
          )}
          <div className="TalkShowStudio__players">
            {localCameraTrack && (
              <div>
                <Player
                  user={localUser}
                  videoTrack={localCameraTrack}
                  showButtons
                  isCamOn={isCameraOn}
                  isMicOn={isMicrophoneOn}
                  isSharing={!!localScreenTrack}
                  toggleCam={stage.toggleCamera}
                  toggleMic={stage.toggleMicrophone}
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
