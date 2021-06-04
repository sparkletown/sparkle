import React, { FC, useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import useAgoraScreenShare from "./agoraHooks/useAgoraScreenShare";
import Player from "./components/Player/Player";
import useAgoraCamera from "./agoraHooks/useAgoraCamera";
import "./ScreenShare.scss";
import useAgoraRemotes from "./agoraHooks/useAgoraRemotes";
import Audience from "./components/Audience/Audience";
import Button from "./components/Button/Button";
import LeaveStageModal from "./components/LeaveStageModal/LeaveStageModal";
import SettingsSidebar from "./components/SettingsSidebar/SettingsSidebar";
import {
  updatePlaceInScreenshareVenue,
  updateShareStatusInScreenshareVenue,
} from "../../../api/profile";
import { useVenueId } from "../../../hooks/useVenueId";
import { useUser } from "../../../hooks/useUser";
import { PlaceInScreenshareVenue } from "../../../types/User";
import useStage from "./useStage";
import { GenericVenue } from "types/venues";
import { WithId } from "utils/id";

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
  venue: WithId<GenericVenue>;
}

export const ScreenShare: FC<ScreenShareProps> = ({ venue }) => {
  const [openLeaveStageModal, setOpenLeaveStageModal] = useState(false);
  const venueId = useVenueId();
  const { userId } = useUser();
  const remoteUsers = useAgoraRemotes(remotesClient, AGORA_CHANNEL);

  useEffect(() => {
    return () => {
      if (venueId && userId) {
        updatePlaceInScreenshareVenue({
          venueId,
          userId,
          placeInScreenshareVenue: PlaceInScreenshareVenue.audience,
        });
        updateShareStatusInScreenshareVenue({
          venueId,
          userId,
          isSharingScreen: false,
        });
      }
    };
  }, [userId, venueId]);

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
    canJoinStage,
    isUserOnStage,
    joinStage,
    leaveStage,
    canShareScreen,
  } = useStage();

  const onStageJoin = () => {
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
  };

  const onStageLeaving = () => {
    cameraClientLeave();
    screenClientLeave();
    leaveStage();
  };

  return (
    <>
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

          <div className="ScreenShare__scene--buttons">
            {isUserOnStage ? (
              <>
                {canShareScreen && (
                  <Button
                    onClick={() => {
                      venueId &&
                        userId &&
                        updateShareStatusInScreenshareVenue({
                          venueId,
                          userId,
                          isSharingScreen: !!localScreenTrack,
                        });
                      localScreenTrack ? stopShare() : shareScreen();
                    }}
                    rightLabel={localScreenTrack && "You are screensharing"}
                    variant="secondary"
                    small
                    disabled={screenClient.connectionState !== "CONNECTED"}
                  >
                    {localScreenTrack ? "Stop Sharing" : "Share Screen"}
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setOpenLeaveStageModal(true);
                  }}
                  leftLabel="You are on stage"
                  variant="secondary"
                  small
                >
                  Leave Stage
                </Button>
              </>
            ) : (
              canJoinStage && (
                <div className="ScreenShare__scene--buttons--join-stage">
                  <Button onClick={onStageJoin} variant="secondary" small>
                    Join Stage
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
        <Audience venue={venue} />
        <LeaveStageModal
          show={openLeaveStageModal}
          onHide={() => {
            setOpenLeaveStageModal(false);
          }}
          onSubmit={onStageLeaving}
        />
      </div>
      <SettingsSidebar />
    </>
  );
};
