import { useEffect } from "react";
import notificationSound from "assets/sounds/notification.m4a";

export const useNotificationSound = (numberOfUnreadMessages: number) => {

  useEffect(() => {
    if (numberOfUnreadMessages <= 0) return

    new Audio(notificationSound).play();
  }, [numberOfUnreadMessages]);
};
