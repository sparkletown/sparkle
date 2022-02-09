import React, { useContext, useMemo, useState } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { useVideoComms } from "../VideoComms/hooks";
import { VideoTrack } from "../VideoComms/types";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: (cb: (prevInHuddle: boolean) => void) => void;

  extraButtons: ButtonConfig[];
  setExtraButtons: (buttons: ButtonConfig[]) => void;
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
  // TODO Make it so classes can be set on the video element
  extraButtons: [],
  setExtraButtons: (buttons: ButtonConfig[]) => [],
});

interface HuddleProviderProps {
  children: React.ReactNode;
}

export const HuddleProvider: React.FC<HuddleProviderProps> = ({ children }) => {
  const [inHuddle, setInHuddle] = useState(false);

  const [extraButtons, setExtraButtons] = useState<ButtonConfig[]>([]);

  const contextState: HuddleContextType = {
    inHuddle,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setInHuddle,
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
    localParticipant,
    joinChannel,
    disconnect,
    remoteParticipants,
    shareScreen,
  } = useVideoComms();

  const { inHuddle, setInHuddle, extraButtons, setExtraButtons } = useContext(
    HuddleContext
  );

  // TODO Docs
  const joinHuddle = useMemo(() => {
    return (userId: string, huddleId: string) => {
      console.log("joining huddle");
      joinChannel(userId, huddleId, false, false);
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
    extraButtons,
    setExtraButtons,
  };
};
