import { useFirestore } from "reactfire";

import { PrivateChatMessage } from "types/chat";
import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { useChatMessagesForDisplay } from "hooks/chats/common/useChatMessages";
import { useUser } from "hooks/useUser";

export const useRecipientChatMessages = (recipient: WithId<DisplayUser>) => {
  const { userId } = useUser();
  const firestore = useFirestore();

  const [messagesToDisplay, replies] =
    useChatMessagesForDisplay<PrivateChatMessage>(
      firestore.collection("privatechats").doc(userId).collection("chats"),
      (message) =>
        message.toUser.id === recipient.id ||
        message.fromUser.id === recipient.id
    );

  return {
    messagesToDisplay,
    replies,
  };
};
