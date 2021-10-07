import { useMemo } from "react";

import { getVenueRef } from "api/venue";

import { JukeboxChatActions, JukeboxMessage } from "types/chat";

import { useChatMessages } from "hooks/chats/common/useChatMessages";
import { useSendChatMessage } from "hooks/chats/common/useSendMessage";

export const useJukeboxChat = ({
  venueId,
  tableId,
}: {
  venueId?: string;
  tableId?: string | null;
}) => {
  const messagesToDisplay = useJukeboxMessages(venueId);

  const actions = useJukeboxActions(venueId, tableId);

  return {
    messagesToDisplay,
    ...actions,
  };
};

const useJukeboxActions = (
  venueId?: string,
  tableId?: string | null
): JukeboxChatActions => {
  const messagesRefs = useMemo(
    () => (venueId ? [getVenueRef(venueId).collection("jukeboxMessages")] : []),
    [venueId]
  );

  const sendMessage = useSendChatMessage<JukeboxMessage>(messagesRefs, {
    tableId: tableId ?? "",
  });

  return { sendChatMessage: sendMessage };
};

const useJukeboxMessages = (venueId?: string) => {
  const [{ messages }] = useChatMessages<JukeboxMessage>(
    getVenueRef(venueId ?? "").collection("jukeboxMessages")
  );

  return messages;
};
