import firebase from "firebase/app";

export const setPrivateChatMessageIsRead = (userId: string, chatId: string) => {
  const firestore = firebase.firestore();
  const doc = `privatechats/${userId}/chats/${chatId}`;
  return firestore.doc(doc).update({ isRead: true });
};
