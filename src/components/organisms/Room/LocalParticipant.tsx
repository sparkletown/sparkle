import React from "react";

import { Participant, ParticipantProps } from "./Participant";

export const LocalParticipant: React.FC<ParticipantProps> = ({
  participant,
  profileData,
  profileDataId,
  defaultMute,
  showIcon = true,
  isAudioEffectDisabled,
}) => {
  return (
    <Participant
      participant={participant}
      profileData={profileData}
      profileDataId={profileDataId}
      showIcon={showIcon}
      defaultMute={defaultMute}
      isAudioEffectDisabled={isAudioEffectDisabled}
    />
  );
};
