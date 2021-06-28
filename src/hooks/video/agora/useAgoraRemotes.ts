import { useCallback, useEffect, useState } from "react";
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useAsync } from "react-use";

import { AGORA_APP_ID, AGORA_CHANNEL } from "secrets";

import { ReactHook } from "types/utility";

import { getAgoraToken } from "api/video";

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

  const { value: token } = useAsync(async () =>
    getAgoraToken({ channelName: AGORA_CHANNEL })
  );

  useEffect(() => {
    if (!client || !token) return;

    updateRemoteUsers();

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", updateRemoteUsers);
    client.on("user-joined", updateRemoteUsers);
    client.on("user-left", updateRemoteUsers);

    // @debt promise returned from .join is ignored
    client.join(AGORA_APP_ID || "", AGORA_CHANNEL || "", token);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", updateRemoteUsers);
      client.off("user-joined", updateRemoteUsers);
      client.off("user-left", updateRemoteUsers);

      // @debt promise returned from .leave is ignored
      client.leave();
    };
  }, [client, handleUserPublished, token, updateRemoteUsers]);

  return remoteUsers;
};
