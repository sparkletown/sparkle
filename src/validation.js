// @debt Is this file needed anymore? It doesn't appear to be used by anything. For future cleanup.

const validDate = (date) => typeof date === "object" && date.seconds > 0;

const validBool = (bool) =>
  bool !== undefined && (bool === true || bool === false);

export const isAnnouncementValid = (announcement) =>
  announcement !== undefined &&
  announcement.id !== undefined &&
  announcement.announcer !== undefined &&
  announcement.ts_utc !== undefined &&
  validDate(announcement.ts_utc) &&
  announcement.text !== undefined;

export const isChatValid = (chat) =>
  chat !== undefined &&
  chat.id !== undefined &&
  chat.ts_utc !== undefined &&
  validDate(chat.ts_utc) &&
  chat.text !== undefined &&
  chat.from !== undefined;

export const isRoomValid = (room) =>
  room !== undefined &&
  validBool(room.on_list) &&
  validBool(room.on_map) &&
  room.path !== undefined &&
  (room.url !== undefined || room.external_url !== undefined) &&
  room.title !== undefined;
