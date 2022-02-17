import React, { useContext, useState } from "react";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";

import { VideoCommsParticipant } from "../VideoComms/VideoCommsParticipant";

import { useVideoHuddle } from "./useVideoHuddle";

import styles from "./VideoHuddle.module.scss";

interface VideoHuddleContextType {
  channelId?: string;
  setChannelId: (channelId?: string) => void;
}

export const VideoHuddleContext = React.createContext<VideoHuddleContextType>({
  setChannelId: () => {},
});

interface VideoHuddleProps {
  userId: string;
}

export const VideoHuddle: React.FC<VideoHuddleProps> = ({ userId }) => {
  const { channelId } = useContext(VideoHuddleContext);

  if (!channelId) {
    return <></>;
  }
  return <ActiveVideoHuddle userId={userId} channelId={channelId} />;
};

interface ActiveVideoHuddleProps {
  channelId: string;
  userId: string;
}

const ActiveVideoHuddle: React.FC<ActiveVideoHuddleProps> = ({
  userId,
  channelId,
}) => {
  const { localParticipant, participants, loading } = useVideoRoomState(
    userId,
    channelId
  );

  const { leaveHuddle } = useVideoHuddle();

  if (loading) {
    // TODO Spinner?
    return <div className={styles.VideoHuddle}>Loading...</div>;
  }

  console.log("in huddle", channelId);

  // TODO Think about how the API is used internally vs externally. Ideally it should all go through the same.

  return (
    <div className={styles.VideoHuddle}>
      <div className={styles.VideoHuddleControls}>
        <a id="video-control-leave" href="#!" onClick={leaveHuddle}>
          <span className="caption">Leave </span>
          <span className="icon"></span>
        </a>
        <a id="video-control-audio" href="#!">
          <span className="caption">Mute audio </span>
          <span className="icon"></span>
        </a>
        <a id="video-control-camera" href="#!">
          <span className="caption">Turn off camera </span>
          <span className="icon"></span>
        </a>
      </div>
      <div className={styles.VideoHuddleVideos}>
        {localParticipant && (
          <div
            className={styles.VideoContainer}
            key={localParticipant.sparkleId}
          >
            <VideoCommsParticipant participant={localParticipant} isLocal />
          </div>
        )}
        {participants.map((participant) => (
          <div
            key={participant.participant.sparkleId}
            className={styles.VideoContainer}
          >
            <VideoCommsParticipant participant={participant.participant} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface VideoHuddleProviderProps {
  children: React.ReactNode;
}

export const VideoHuddleProvider: React.FC<VideoHuddleProviderProps> = ({
  children,
}) => {
  const [channelId, setChannelId] = useState<string>();
  return (
    <VideoHuddleContext.Provider value={{ channelId, setChannelId }}>
      {children}
    </VideoHuddleContext.Provider>
  );
};
