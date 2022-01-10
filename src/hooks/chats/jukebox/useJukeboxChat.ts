import { useMemo } from "react";
import { collection, DocumentReference } from "firebase/firestore";

import { getVenueRef } from "api/venue";

import { JukeboxChatActions, JukeboxMessage } from "types/chat";

import { withIdConverter } from "utils/converters";

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
  const additionalFields = useMemo(
    () => ({
      tableId: tableId ?? "",
    }),
    [tableId]
  );

  const sendMessage = useSendChatMessage<JukeboxMessage>(
    messagesRefs,
    additionalFields
  );

  return { sendChatMessage: sendMessage };
};

const useJukeboxMessages = (venueId?: string) => {
  const [{ messages }] = useChatMessages<JukeboxMessage>(
    collection(
      getVenueRef(venueId ?? "") as unknown as DocumentReference,
      "jukeboxMessages"
    ).withConverter<JukeboxMessage>(withIdConverter())
  );

  return messages;
};
