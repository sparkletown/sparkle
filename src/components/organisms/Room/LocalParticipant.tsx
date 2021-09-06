import React from "react";

import { CameraMicrophoneControls } from "components/molecules/CameraMicrophoneControls";

import { Participant, ParticipantProps } from "./Participant";

export const LocalParticipant: React.FC<ParticipantProps> = ({
  participant,
  profileData,
  profileDataId,
  bartender,
  defaultMute = false,
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
      isAudioEffectDisabled={isAudioEffectDisabled}
    >
      <CameraMicrophoneControls
        containerClassName="mute-container"
        participant={participant}
        defaultMute={defaultMute}
      />
    </Participant>
  );
};
