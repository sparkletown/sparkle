import { useFirestore } from "reactfire";
import { collection, CollectionReference } from "firebase/firestore";

import { PrivateChatMessage } from "types/chat";
import { DisplayUser } from "types/User";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useChatMessagesForDisplay } from "hooks/chats/common/useChatMessages";
import { useUser } from "hooks/useUser";

export const useRecipientChatMessages = (recipient: WithId<DisplayUser>) => {
  const { userId } = useUser();
  const firestore = useFirestore();

  const messagesRef = collection(
    firestore,
    "privatechats",
    convertToFirestoreKey(userId),
    "chats"
  ) as CollectionReference<PrivateChatMessage>;

  const [
    messagesToDisplay,
    replies,
  ] = useChatMessagesForDisplay<PrivateChatMessage>(
    messagesRef,
    (message) =>
      message.toUser.id === recipient.id || message.fromUser.id === recipient.id
  );

  return {
    messagesToDisplay,
    replies,
  };
};
