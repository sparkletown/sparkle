import { useContext, useMemo } from "react";

import { useVideoComms } from "../VideoComms/hooks";

import { HuddleContext } from "./HuddleProvider";

/**
 * Allows a developer to interact with the "huddle" component that persists
 * across space navigations.
 *
 * Extra buttons can be added to the huddle by spaces that want to add
 * extra behaviour on a per-video-track basis. This is done in a restrictive way
 * to ensure that the look-and-feel of the huddle component is consistent and
 * not a free for all (as would happen if arbitrary children could be added).
 *
 * For the most part, joinHuddle and leaveHuddle will be all that anyone
 * needs to use.
 */
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

  const joinHuddle = useMemo(() => {
    return (userId: string, huddleId: string) => {
      joinChannel(userId, huddleId, false, false);
      setInHuddle(() => true);
    };
  }, [joinChannel, setInHuddle]);

  const leaveHuddle = useMemo(() => {
    return () => {
      // Use the callback version of state setting so that the state is not
      // used to determine the memo wrapping this.
      setInHuddle((prevInHuddle) => {
        if (prevInHuddle) {
          disconnect();
        }
        return false;
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
