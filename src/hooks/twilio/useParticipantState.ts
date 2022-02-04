import { RefObject, useCallback, useRef } from "react";
import { useToggle } from "react-use";
import {
  faEye,
  faEyeSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { useIsLocalParticipant } from "hooks/twilio/useIsLocalParticipant";
import { useParticipantMediaState } from "hooks/twilio/useParticipantMediaState";

type RefType<T extends "audio" | "video"> = T extends "audio"
  ? HTMLAudioElement
  : HTMLVideoElement;

interface UseVideoParticipantReturnType<T extends "audio" | "video"> {
  shouldDisableExternally: boolean;
  handleToggle: () => void;
  icon: IconDefinition;
  iconColor: string | undefined;
  ref: RefObject<RefType<T>>;
}

export const useParticipantState = <T extends "audio" | "video">(
  media: T,
  participant: LocalParticipant | RemoteParticipant,
  defaultMute: boolean
): UseVideoParticipantReturnType<T> => {
  const isMe = useIsLocalParticipant(participant);

  const ref = useRef<RefType<T>>(null);
  const { isEnabled: isTwilioEnabled, toggle } = useParticipantMediaState(
    media,
    ref,
    participant,
    defaultMute
  );

  const icons: Record<string, IconDefinition> =
    media === "video"
      ? {
          meEnabled: faVideo,
          meDisabled: faVideoSlash,
          otherEnabled: faEye,
          otherDisabled: faEyeSlash,
        }
      : {
          meEnabled: faMicrophone,
          meDisabled: faMicrophoneSlash,
          otherEnabled: faVolumeUp,
          otherDisabled: faVolumeMute,
        };

  const [isUserEnabled, toggleEnableOverride] = useToggle(true);

  const handleToggle = useCallback(() => {
    if (isMe) toggle();
    else toggleEnableOverride();
  }, [isMe, toggle, toggleEnableOverride]);

  const shouldDisableExternally = isMe ? !isTwilioEnabled : !isUserEnabled;

  return {
    handleToggle,
    shouldDisableExternally: shouldDisableExternally,
    icon:
      icons[
        `${isMe ? "me" : "other"}${
          shouldDisableExternally ? "Disabled" : "Enabled"
        }`
      ],
    ref,
    iconColor: shouldDisableExternally ? "red" : undefined,
  };
};
