import React, { FC, useCallback, useEffect, useMemo } from "react";
import { IAgoraRTCRemoteUser, ILocalVideoTrack } from "agora-rtc-sdk-ng";

import { AgoraClientConnectionState } from "types/agora";
import { TalkShowStudioVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAgoraCamera } from "hooks/useAgoraCamera";
import { useAgoraRemotes } from "hooks/useAgoraRemote";
import { useAgoraScreenShare } from "hooks/useAgoraScreenSharing";
import { useStage } from "hooks/useStage";
import { useUpdateTalkShowRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";
import { useUser } from "hooks/useUser";

import { Audience } from "./components/Audience/Audience";
import { ControlBar } from "./components/ControlBar";
import { Player } from "./components/Player/Player";
import { SettingsSidebar } from "./components/SettingsSidebar/SettingsSidebar";

import "./TalkShowStudio.scss";

export interface TalkShowStudioProps {
  venue: WithId<TalkShowStudioVenue>;
}

export const TalkShowStudio: FC<TalkShowStudioProps> = ({ venue }) => {
  const stage = useStage();
  const { userId, profile } = useUser();
  const isRequestToJoinStageEnabled = venue.requestToJoinStage;

  useUpdateTalkShowRecentSeatedUsers(venue?.id);

  const remoteUsers = useAgoraRemotes();

  const {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    client: cameraClient,
    joinChannel: cameraClientJoin,
    leaveChannel: cameraClientLeave,
  } = useAgoraCamera();

  const {
    localScreenTrack,
    shareScreen,
    stopShare,
    client: screenClient,
    joinChannel: screenClientJoin,
    leaveChannel: screenClientLeave,
  } = useAgoraScreenShare();

  const localUser = useMemo(
    () => stage.peopleOnStage.find(({ id }) => id === userId),
    [userId, stage.peopleOnStage]
  );

  const isUserOwner = useMemo(() => !!userId && venue.owners.includes(userId), [
    venue.owners,
    userId,
  ]);

  const [userOnStageSharingScreen] = useMemo(
    () =>
      stage.peopleOnStage.filter(
        ({ data }) => data?.[`${venue.id}`]?.isSharingScreen
      ),
    [stage.peopleOnStage, venue.id]
  );
  const remoteScreenTrackUser = useMemo(
    () =>
      remoteUsers.find(
        ({ uid }) =>
          `${uid}` ===
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.screenClientUid
      ),
    [userOnStageSharingScreen?.data, remoteUsers, venue.id]
  );
  const remoteCameraTrackUser = useMemo(
    () =>
      remoteUsers.find(
        ({ uid }) =>
          `${uid}` ===
          userOnStageSharingScreen?.data?.[`${venue.id}`]?.cameraClientUid
      ),
    [userOnStageSharingScreen?.data, remoteUsers, venue.id]
  );

  const remoteUsersPlayers = useMemo(() => {
    const findUserByAgoraUid = (remoteUserId: number | string) => {
      if (!venue.id) return;

      return stage.peopleOnStage.find(
        ({ data }) =>
          data?.[`${venue.id}`]?.cameraClientUid === `${remoteUserId}`
      );
    };

    return remoteUsers
      .filter(({ uid }) => {
        const sharingUser = userOnStageSharingScreen?.data?.[`${venue.id}`];

        return (
          `${uid}` !== sharingUser?.cameraClientUid &&
          `${uid}` !== sharingUser?.screenClientUid
        );
      })
      .map((agoraRemoteUser) => {
        const user = findUserByAgoraUid(agoraRemoteUser.uid);
        if (
          !user ||
          agoraRemoteUser.uid === screenClient?.uid ||
          agoraRemoteUser.uid === cameraClient?.uid
        )
          return null;

        return (
          <div key={agoraRemoteUser.uid}>
            <Player
              showButtons
              user={user}
              videoTrack={agoraRemoteUser.videoTrack}
              audioTrack={agoraRemoteUser.audioTrack}
              isCamOn={agoraRemoteUser.hasVideo}
              isMicOn={agoraRemoteUser.hasAudio}
              toggleCam={isUserOwner ? stage.toggleUserCamera : undefined}
              toggleMic={isUserOwner ? stage.toggleUserMicrophone : undefined}
              containerClass="TalkShowStudio__mode--play"
            />
          </div>
        );
      });
  }, [
    isUserOwner,
    remoteUsers,
    venue.id,
    cameraClient?.uid,
    screenClient?.uid,
    stage.peopleOnStage,
    stage.toggleUserCamera,
    stage.toggleUserMicrophone,
    userOnStageSharingScreen,
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
    cameraClient?.connectionState === AgoraClientConnectionState.DISCONNECTED &&
      stage.isUserOnStage &&
      onStageJoin();

    cameraClient?.connectionState === AgoraClientConnectionState.CONNECTED &&
      !stage.isUserOnStage &&
      onStageLeaving();
  }, [
    stage.isUserOnStage,
    onStageJoin,
    onStageLeaving,
    cameraClient?.connectionState,
  ]);

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

  const renderScreenSharing = (
    localScreen?: ILocalVideoTrack,
    localCamera?: ILocalVideoTrack,
    remoteScreenUser?: IAgoraRTCRemoteUser,
    remoteCameraUser?: IAgoraRTCRemoteUser
  ) => {
    if (!localScreen && !remoteScreenUser?.videoTrack) return;
    const commonPlayerProps = {
      isSharing: true,
      showButtons: true,
      containerClass: "TalkShowStudio__mode--local-play",
    };

    return (
      <div className="TalkShowStudio__scene--sharing">
        <Player
          videoTrack={localScreen || remoteScreenUser?.videoTrack}
          containerClass="TalkShowStudio__mode--share"
        />
        {localScreen && localCamera ? (
          <Player
            isLocalPlayer
            user={localUser}
            videoTrack={localCamera}
            isCamOn={isCameraOn}
            isMicOn={isMicrophoneOn}
            toggleCam={stage.toggleCamera}
            toggleMic={stage.toggleMicrophone}
            {...commonPlayerProps}
          />
        ) : (
          <Player
            user={userOnStageSharingScreen}
            videoTrack={remoteCameraUser?.videoTrack}
            audioTrack={remoteCameraUser?.audioTrack}
            isCamOn={remoteCameraUser?.hasVideo}
            isMicOn={remoteCameraUser?.hasAudio}
            toggleCam={isUserOwner ? stage.toggleUserCamera : undefined}
            toggleMic={isUserOwner ? stage.toggleUserMicrophone : undefined}
            {...commonPlayerProps}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="TalkShowStudio">
        <div className="TalkShowStudio__scene">
          {renderScreenSharing(
            localScreenTrack,
            localCameraTrack,
            remoteScreenTrackUser,
            remoteCameraTrackUser
          )}
          <div className="TalkShowStudio__players">
            {localCameraTrack && !localScreenTrack && (
              <div>
                <Player
                  isLocalPlayer
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
              screenClient?.connectionState !==
              AgoraClientConnectionState.CONNECTED
            }
            onStageJoin={onStageJoin}
            onStageLeaving={onStageLeaving}
            shareScreen={shareScreen}
            stopShare={stopShare}
            isRequestToJoinStageEnabled={isRequestToJoinStageEnabled}
          />
        </div>
        <Audience venue={venue} />
      </div>
      <SettingsSidebar venue={venue} />
    </>
  );
};
