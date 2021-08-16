// @debt Is this file needed anymore? It doesn't appear to be used by anything. For future cleanup.

function validDate(date) {
  return typeof date === "object" && date.seconds > 0;
}

function validBool(bool) {
  return bool !== undefined && (bool === true || bool === false);
}

export function isAnnouncementValid(announcement) {
  return (
    announcement !== undefined &&
    announcement.id !== undefined &&
    announcement.announcer !== undefined &&
    announcement.ts_utc !== undefined &&
    validDate(announcement.ts_utc) &&
    announcement.text !== undefined
  );
}

export function isChatValid(chat) {
  return (
    chat !== undefined &&
    chat.id !== undefined &&
    chat.ts_utc !== undefined &&
    validDate(chat.ts_utc) &&
    chat.text !== undefined &&
    chat.from !== undefined
  );
}

export function isRoomValid(room) {
  return (
    room !== undefined &&
    validBool(room.on_list) &&
    validBool(room.on_map) &&
    room.path !== undefined &&
    (room.url !== undefined || room.external_url !== undefined) &&
    room.title !== undefined
  );
}
