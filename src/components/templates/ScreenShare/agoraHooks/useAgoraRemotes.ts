import { IAgoraRTCClient, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useState } from "react";

const useAgoraRemotes = (
  client: IAgoraRTCClient | undefined,
  channel: { appId: string; channel: string; token: string }
) => {
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
    client.join(channel.appId, channel.channel, channel.token);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", updateRemoteUsers);
      client.off("user-joined", updateRemoteUsers);
      client.off("user-left", updateRemoteUsers);
      client.leave();
    };
  }, [client, handleUserPublished, updateRemoteUsers, channel]);

  return remoteUsers;
};

export default useAgoraRemotes;
