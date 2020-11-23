import { chatSort, PrivateChatMessage } from "components/context/ChatContext";
import { VENUE_CHAT_AGE_DAYS } from "settings";
import { CampRoomData } from "types/CampRoomData";
import { User } from "types/User";
import { WithId } from "./id";

import { isWithinBounds } from "./isWithinBounds";
import { getDaysAgoInSeconds, roundToNearestHour } from "./time";

const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

/**
 * To be used with Array Filter ([].filter()) and similar.
 *
 * @param item the item in the array being processed
 *
 * @example
 *   const somethingTrue = true
 *   const somethingFalse = false
 *
 *   const myArray = [
 *     'A',                          // 'A'
 *     somethingFalse && 'B',        // false
 *     'C',                          // 'C'
 *     somethingTrue && 'D',         // 'D'
 *     'etc',                        // 'etc'
 *   ]
 *
 *   myArray.filter(isTruthyFilter)  // ['A', 'C', 'D', 'etc']
 *
 */
export const isTruthyFilter = <T>(item?: T | false): item is T => !!item;

/**
 * @see makeCampRoomHitFilter
 */
export type RoomHitFilterProps = {
  row: number;
  column: number;
  totalRows: number;
  totalColumns: number;
};

/**
 * Make a CampRoomData[] filter for rooms 'hit' by the supplied row/column.
 *
 * @param row
 * @param column
 * @param totalRows
 * @param totalColumns
 */
export const makeCampRoomHitFilter = ({
  row,
  column,
  totalRows,
  totalColumns,
}: RoomHitFilterProps) => (room: CampRoomData) => {
  const checkPercentRow = (row / totalRows) * 100;
  const checkPercentColumn = (column / totalColumns) * 100;

  // Rows are distributed along the Y axis, columns on the X axis
  const checkPercent = { x: checkPercentColumn, y: checkPercentRow };

  const roomBounds = {
    x: Math.round(room.x_percent),
    y: Math.round(room.y_percent),
    width: Math.round(room.width_percent),
    height: Math.round(room.height_percent),
  };

  return isWithinBounds(checkPercent, roomBounds);
};

export const filterUnreadPrivateChats = (
  chats: WithId<PrivateChatMessage>[]
) => {
  return (
    chats
      ?.filter(
        (message) =>
          message.deleted !== true &&
          message.type === "private" &&
          message.ts_utc.seconds > HIDE_BEFORE &&
          message.isRead === false
      )
      .sort(chatSort) ?? []
  );
};
