import React, { FC, useCallback, useEffect, useMemo } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  // IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

import { WithId } from "utils/id";
import { useStage } from "./useStage";
import { FullTalkShowVenue } from "types/venues";
import { useUser } from "../../../hooks/useUser";
import { useSelector } from "../../../hooks/useSelector";
import {
  useAgoraCamera,
  useAgoraRemotes,
  useAgoraScreenShare,
} from "hooks/video/agora";

import AppButton from "../../atoms/Button";
import Player from "./components/Player/Player";
// import Player, { VideoPlayerProps } from "./components/Player/Player";
import { ControlBar } from "./components/ControlBar";
import Audience from "./components/Audience/Audience";
import { AgoraClientConnectionState } from "../../../types/agora";
import { currentVenueSelectorData } from "../../../utils/selectors";
import SettingsSidebar from "./components/SettingsSidebar/SettingsSidebar";
// import { useVenueId } from "hooks/useVenueId";

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
  // const venueId = useVenueId();
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

  // const [localUser] = useMemo(
  //   () => stage.peopleOnStage.filter(({ id }) => id === userId),
  //   [userId, stage.peopleOnStage]
  // );

  const isUserOwner = useMemo(
    () => !!userId && currentVenue?.owners.includes(userId),
    [currentVenue?.owners, userId]
  );

  const remoteUsersPlayers = useMemo(() => {
    return remoteUsers.map(
      (user) =>
        user.uid !== screenClient.uid &&
        user.uid !== cameraClient.uid && (
          <div key={user.uid}>
            {user.hasVideo && (
              <Player
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
                containerClass="TalkShowStudio__mode--play"
              />
            )}
          </div>
        )
    );
  }, [remoteUsers]);

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

  // const renderRemotesUsers = useMemo(() => {
  //   // TODO: strict render remote user when he is screenSharing
  //   const validateUser = (user: IAgoraRTCRemoteUser) =>
  //     user.hasVideo &&
  //     user.uid !== screenClient.uid &&
  //     user.uid !== cameraClient.uid;
  //   const setremoteUserAvatar = (remoteUserId: number | string) => {
  //     if (!venueId) return;
  //     const [remoteUser] = stage.peopleOnStage.filter(
  //       ({ data }) => data?.[`${venueId}`]?.cameraClientUid === remoteUserId
  //     );
  //     return remoteUser;
  //   };

  //   return remoteUsers
  //     .filter(validateUser)
  //     .map((user) => (
  //       <Player
  //         key={user.uid}
  //         videoTrack={user.videoTrack}
  //         audioTrack={user.audioTrack}
  //         containerClass="ScreenShare__mode--play"
  //         user={setremoteUserAvatar(user.uid)}
  //       />
  //     ));
  // }, [stage.peopleOnStage, remoteUsers, venueId]);

  // const renderScreenSharing = (
  //   screenTrack: VideoPlayerProps["videoTrack"],
  //   cameraTrack: VideoPlayerProps["videoTrack"]
  // ) => {
  //   return (
  //     <div className="ScreenShare__scene--sharing">
  //       {screenTrack && (
  //         <Player
  //           videoTrack={screenTrack}
  //           containerClass="ScreenShare__mode--share"
  //         />
  //       )}
  //       {cameraTrack && (
  //         <Player
  //           user={localUser}
  //           videoTrack={cameraTrack}
  //           showButtons
  //           isCamOn={isCameraOn}
  //           isMicOn={isMicrophoneOn}
  //           isSharing={!!screenTrack}
  //           toggleCam={toggleCamera}
  //           toggleMic={toggleMicrophone}
  //           containerClass="ScreenShare__mode--local-play"
  //         />
  //       )}
  //     </div>
  //   );
  // };

  return (
    <>
      <div className="TalkShowStudio">
        <div className="TalkShowStudio__scene">
          {localScreenTrack && (
            <div className="TalkShowStudio__scene--sharing">
              <Player
                videoTrack={localScreenTrack}
                containerClass="TalkShowStudio__mode--share"
              />
            </div>
          )}
          <div className="TalkShowStudio__players">
            {localCameraTrack && (
              <div>
                <Player
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
        {stage.isUserRequesting && (
          <AppButton
            customClass="TalkShowStudio__request-button"
            onClick={stage.leaveStage}
          >
            Cancel Request
          </AppButton>
        )}
        <Audience venue={venue} />
      </div>
      <SettingsSidebar venue={venue} />
    </>
  );
};
