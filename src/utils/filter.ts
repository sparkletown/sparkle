import { Room } from "types/rooms";

import { isWithinBounds } from "./isWithinBounds";

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
 * @see makeRoomHitFilter
 */
export type RoomHitFilterProps = {
  row: number;
  column: number;
  totalRows: number;
  totalColumns: number;
};

/**
 * Make a PartyMapRoomData[] filter for rooms 'hit' by the supplied row/column.
 *
 * @param row
 * @param column
 * @param totalRows
 * @param totalColumns
 */
export const makeRoomHitFilter = ({
  row,
  column,
  totalRows,
  totalColumns,
}: RoomHitFilterProps) => (room: Room) => {
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

export const filterEnabledRooms = (room: Room) => room.isEnabled;
