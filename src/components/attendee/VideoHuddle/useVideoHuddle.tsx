import React, { useContext, useMemo, useState } from "react";

import { useVideoComms } from "../VideoComms/hooks";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: (inHuddle: boolean) => void;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: false,
  setInHuddle: () => { },
});

interface HuddleProviderProps {
  children: React.ReactNode;
}

export const HuddleProvider: React.FC<HuddleProviderProps> = ({
  children,
}) => {
  const [inHuddle, setInHuddle] = useState(false);

  const contextState = {
    inHuddle,
    setInHuddle,
  }

  return <HuddleContext.Provider value={contextState}>
    {children}
  </HuddleContext.Provider>
};

export const useVideoHuddle = () => {
  const {
    status,
    localParticipant,
    joinChannel,
    disconnect,
    remoteParticipants,
  } = useVideoComms();

  const { inHuddle, setInHuddle } = useContext(HuddleContext);

  // TODO Docs
  const joinHuddle = useMemo(() => {
    return (userId: string, huddleId: string) => {
      console.log("joining huddle");
      joinChannel(userId, huddleId);
      setInHuddle(true);
    }
  }, [joinChannel, setInHuddle]);

  // TODO Docs
  const leaveHuddle = useMemo(() => {
    return () => {
      if (inHuddle) {
        console.log("leaving huddle");
        disconnect();
        setInHuddle(false);
      }
    }
  }, [disconnect, inHuddle, setInHuddle]);

  return {
    joinHuddle,
    leaveHuddle,
    inHuddle,
    localParticipant,
    remoteParticipants,
  };
};
