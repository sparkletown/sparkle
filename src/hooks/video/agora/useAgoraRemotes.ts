import { useCallback, useEffect, useState } from "react";
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "secrets";

import { ReactHook } from "types/utility";

export interface UseAgoraRemotesProps {
  client?: IAgoraRTCClient;
}
export type UseAgoraRemotesReturn = IAgoraRTCRemoteUser[];

export const useAgoraRemotes: ReactHook<
  UseAgoraRemotesProps,
  UseAgoraRemotesReturn
> = ({ client }) => {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const updateRemoteUsers = useCallback(() => {
    if (!client) return;

    setRemoteUsers(() => Array.from(client.remoteUsers));
  }, [client]);

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      if (!client) return;

      await client.subscribe(user, mediaType);
      updateRemoteUsers();
    },
    [client, updateRemoteUsers]
  );

  useEffect(() => {
    if (!client) return;

    updateRemoteUsers();

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", updateRemoteUsers);
    client.on("user-joined", updateRemoteUsers);
    client.on("user-left", updateRemoteUsers);

    // @debt promise returned from .join is ignored
    client.join(AGORA_APP_ID || "", AGORA_CHANNEL || "", AGORA_TOKEN || null);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", updateRemoteUsers);
      client.off("user-joined", updateRemoteUsers);
      client.off("user-left", updateRemoteUsers);

      // @debt promise returned from .leave is ignored
      client.leave();
    };
  }, [client, handleUserPublished, updateRemoteUsers]);

  return remoteUsers;
};
