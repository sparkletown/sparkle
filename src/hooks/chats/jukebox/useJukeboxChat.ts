import { useMemo } from "react";

import { getVenueRef } from "api/venue";

import { JukeboxChatActions, JukeboxMessage } from "types/chat";

import { useChatActions } from "hooks/chats/useChatActions";
import { useChatMessages } from "hooks/chats/useChatMessages";

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

  return useChatActions<JukeboxMessage>(messagesRefs, {
    tableId: tableId ?? "",
  });
};

const useJukeboxMessages = (venueId?: string) => {
  const [{ messages }] = useChatMessages<JukeboxMessage>(
    getVenueRef(venueId ?? "").collection("jukeboxMessages")
  );

  return messages;
};