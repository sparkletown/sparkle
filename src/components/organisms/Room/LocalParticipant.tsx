import React from "react";

import { Participant, ParticipantProps } from "./Participant";

export const LocalParticipant: React.FC<ParticipantProps> = ({
  participant,
  profileData,
  profileDataId,
  bartender,
  defaultMute,
  showIcon = true,
  isAudioEffectDisabled,
}) => {
  return (
    <Participant
      participant={participant}
      profileData={profileData}
      profileDataId={profileDataId}
      bartender={bartender}
      showIcon={showIcon}
      defaultMute={defaultMute}
      isAudioEffectDisabled={isAudioEffectDisabled}
    />
  );
};
