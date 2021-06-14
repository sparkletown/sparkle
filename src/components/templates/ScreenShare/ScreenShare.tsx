import React, { FC, useCallback, useEffect, useMemo } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { FullTalkShowVenue } from "types/venues";
import { WithId } from "utils/id";
import useAgoraScreenShare from "./agoraHooks/useAgoraScreenShare";
import Player, { VideoPlayerProps } from "./components/Player/Player";
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
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
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
  const venueId = useVenueId();

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
    peopleOnStage,
    joinStage,
    leaveStage,
    requestJoinStage,
    canJoinStage,
    isUserOnStage,
  } = useStage();

  const [localUser] = useMemo(
    () => peopleOnStage.filter(({ id }) => id === userId),
    [userId, peopleOnStage]
  );

  const onStageJoin = useCallback(() => {
    cameraClientJoin(
      AGORA_CHANNEL.appId,
      AGORA_CHANNEL.channel,
      AGORA_CHANNEL.token
    );
    // TODO: now screenClientUid is set on Stage join. screenClientUid is condition to render screen share mode
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

  const renderRemotesUsers = useMemo(() => {
    // TODO: strict render remote user when he is screenSharing
    const validateUser = (user: IAgoraRTCRemoteUser) =>
      user.hasVideo &&
      user.uid !== screenClient.uid &&
      user.uid !== cameraClient.uid;
    const setremoteUserAvatar = (remoteUserId: number | string) => {
      if (!venueId) return;
      const [remoteUser] = peopleOnStage.filter(
        ({ data }) => data?.[`${venueId}`]?.cameraClientUid === remoteUserId
      );
      return remoteUser;
    };

    return remoteUsers
      .filter(validateUser)
      .map((user) => (
        <Player
          key={user.uid}
          videoTrack={user.videoTrack}
          audioTrack={user.audioTrack}
          containerClass="ScreenShare__mode--play"
          user={setremoteUserAvatar(user.uid)}
        />
      ));
  }, [peopleOnStage, remoteUsers, venueId]);

  const renderScreenSharing = (
    screenTrack: VideoPlayerProps["videoTrack"],
    cameraTrack: VideoPlayerProps["videoTrack"]
  ) => {
    return (
      <div className="ScreenShare__scene--sharing">
        {screenTrack && (
          <Player
            videoTrack={screenTrack}
            containerClass="ScreenShare__mode--share"
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
            containerClass="ScreenShare__mode--local-play"
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="ScreenShare">
        <div className="ScreenShare__scene">
          {/* TODO: add condition to render remote user when he is screensharing */}
          {localScreenTrack &&
            localCameraTrack &&
            renderScreenSharing(localScreenTrack, localCameraTrack)}
          <div className="ScreenShare__scene--players">
            {!localScreenTrack && localCameraTrack && (
              <Player
                user={localUser}
                videoTrack={localCameraTrack}
                showButtons
                isCamOn={isCameraOn}
                isMicOn={isMicrophoneOn}
                isSharing={!!localScreenTrack}
                toggleCam={toggleCamera}
                toggleMic={toggleMicrophone}
                containerClass="ScreenShare__mode--play"
              />
            )}
            {renderRemotesUsers}
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
