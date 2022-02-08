import React, { useContext, useMemo, useState } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { useVideoComms } from "../VideoComms/hooks";
import { VideoTrack } from "../VideoComms/types";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: (cb: (prevInHuddle: boolean) => void) => void;

  augmentFunction?: React.FC<AugmentProps>;
  setAugmentFunction: (cb?: React.FC<AugmentProps>) => void;

  extraButtons: ButtonConfig[];
  setExtraButtons: (buttons: ButtonConfig[]) => void;
}
interface AugmentProps {
  track: VideoTrack;
}

export type ButtonCallbackArgs = {
  track: VideoTrack;
};

export interface ButtonConfig {
  icon: IconDefinition;
  callback: (args: ButtonCallbackArgs) => void;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: false,
  setInHuddle: (cb: (prevInHuddle: boolean) => void) => {},
  augmentFunction: undefined,
  setAugmentFunction: (cb?: React.FC<AugmentProps>) => {},
  // TODO Make extra buttons a configurable array of icons, tooltips, callbacks
  // TODO Make it so classes can be set on the video element
  extraButtons: [],
  setExtraButtons: (buttons: ButtonConfig[]) => [],
});

interface HuddleProviderProps {
  children: React.ReactNode;
}

export const HuddleProvider: React.FC<HuddleProviderProps> = ({ children }) => {
  const [inHuddle, setInHuddle] = useState(false);
  const [augmentFunction, setAugmentFunction] = useState<
    undefined | React.FC<AugmentProps>
  >(undefined);

  const [extraButtons, setExtraButtons] = useState<ButtonConfig[]>([]);

  const contextState: HuddleContextType = {
    inHuddle,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setInHuddle,
    augmentFunction,
    setAugmentFunction,
    extraButtons,
    setExtraButtons,
  };

  return (
    <HuddleContext.Provider value={contextState}>
      {children}
    </HuddleContext.Provider>
  );
};

export const useVideoHuddle = () => {
  const {
    status,
    localParticipant,
    joinChannel,
    disconnect,
    remoteParticipants,
    shareScreen,
  } = useVideoComms();

  const {
    inHuddle,
    setInHuddle,
    augmentFunction,
    setAugmentFunction,
    extraButtons,
    setExtraButtons,
  } = useContext(HuddleContext);

  // TODO Docs
  const joinHuddle = useMemo(() => {
    return (userId: string, huddleId: string) => {
      console.log("joining huddle");
      joinChannel(userId, huddleId);
      setInHuddle(() => true);
    };
  }, [joinChannel, setInHuddle]);

  // TODO Docs
  const leaveHuddle = useMemo(() => {
    return () => {
      // Use the callback version of state setting so that the state is not
      // used to determine the memo wrapping this.
      setInHuddle((prevInHuddle) => {
        if (prevInHuddle) {
          console.log("leaving huddle");
          disconnect();
          setInHuddle(() => false);
        }
      });
    };
  }, [disconnect, setInHuddle]);

  return {
    joinHuddle,
    leaveHuddle,
    inHuddle,
    localParticipant,
    remoteParticipants,
    shareScreen,
    augmentFunction,
    setAugmentFunction,
    extraButtons,
    setExtraButtons,
  };
};
