import { Box, Point as QPoint, QuadTree } from "js-quadtree";
import { intersection } from "lodash";

import { RoomInfo } from "../../../vendors/playerio/PlayerIO";
import EventProvider, { EventType } from "../../EventProvider/EventProvider";
import {
  RoomMath,
  Tuple,
} from "../Contructor/PlayerIO/RoomOperator/RoomLogic/RoomMath";
import { RoomTypes } from "../Contructor/PlayerIO/types";

export const ROOM_PREFIX = "Z_";
export const MIRROR_ROOM_PREFIX = "mZ_"; //Note: don't make this prefix a substring ROOM_PREFIX (or rewrite getRoomNumberById)

export const initialRoomData = {};
export type RoomDataType = typeof initialRoomData;
export type RoomInfoType = RoomInfo<RoomDataType, RoomTypes>;

export interface RoomItem extends RoomInfoType {
  roomNumber: number;
  depth: number;
  bounds: Tuple<[number, number], 4>;
}

export interface RoomPointNode {
  x: number;
  y: number;
  data: string[]; //rooms ids
}

/**
 * A complex data structure using an array for the basic representation of rooms.
 * And also using quadtree, for a quick search for the crossing of main room.
 */
export class RoomsModel {
  private _list: RoomItem[] = [];
  private _idList: string[] = [];
  private _tree: QuadTree;
  private _treeItemList: RoomPointNode[] = [];

  get size() {
    return this._list.length;
  }

  constructor(public worldWidth: number, public worldHeight: number) {
    this._tree = new QuadTree(new Box(0, 0, worldWidth, worldHeight), {
      maximumDepth: 20,
      capacity: 9,
      removeEmptyNodes: true,
    });
  }

  updateList(listRooms: RoomInfoType[]) {
    const newList = normilizeListRoom(listRooms);
    const newIdList = newList.map((item) => item.id);

    // const notChangedRooms = newIdList.filter(item => this._idList.includes(item));
    const addedRooms = newIdList.filter((item) => !this._idList.includes(item));
    // const removedRooms = this._idList.filter(item => !newIdList.includes(item));

    // if (removedRooms.length > 0) {
    //
    // }
    //
    // if (removedRooms.length > 0 && notChangedRooms.length > 0) {
    //
    // }

    if (addedRooms.length > 0) {
      this._addRoomsToTree(addedRooms);
    }

    this._list = newList;
  }

  divideRoomNode(room: RoomItem) {
    const roomsNumbers = RoomMath.getDividedParts(room.roomNumber);
    return roomsNumbers.map((roomNumber) => this.createRoomNode(roomNumber));
  }

  createRoomNode(roomNumber: number) {
    const roomId = getRoomIdByRoomNumber(roomNumber);
    const { depth, bounds } = RoomMath.getFramePoint(roomNumber);
    console.log(bounds);
    const newRoom: RoomItem = {
      id: roomId,
      roomNumber: roomNumber,
      depth: depth,
      bounds: bounds,
      roomType: RoomTypes.Zone,
      roomData: initialRoomData,
      onlineUsers: 0,
    };
    this._addRoomsToTree([roomId]);
    this._list.push(newRoom);
    this._idList.push(roomId);
    return newRoom;
  }

  private _addRoomsToTree(roomIds: string[]) {
    const treeItems = this._treeItemList;
    const newPoints: QPoint[] = [];
    roomIds.forEach((roomId) => {
      const { bounds: points } = RoomMath.getFramePoint(
        getRoomNumberById(roomId)
      );

      points.forEach((point) => {
        const x = point[0];
        const y = point[1];
        const existingPoint = treeItems.find(
          (item) => item.x === x && item.y === y
        );
        if (existingPoint) existingPoint.data.push(roomId);
        else {
          const p = { x: x, y: y, data: [roomId] };
          newPoints.push(p);
          treeItems.push(p);
        }
      });

      EventProvider.emit(EventType.ON_ROOMS_CHANGED, this._treeItemList);
    });
    this._tree.insert(newPoints);
  }

  public getRoomByPoint(point: { x: number; y: number }) {
    const roomsResult = this._list.filter((room) =>
      RoomMath.isPointInBounds(point, room.bounds)
    );

    if (roomsResult.length === 1) return roomsResult[0];

    if (roomsResult.length === 0) {
      const allRooms = this._list.map((room) => room.roomNumber);
      //todo: relocate to math class
      let offset = 1;
      let tempId = 0;
      for (let n = 1; n < 9; n++) {
        //todo: max_depth

        const maxRoomId = Math.pow(9, n);
        for (let i = 0; i < maxRoomId; i++) {
          if (
            RoomMath.isPointInBounds(
              point,
              RoomMath.getFramePoint(i + offset).bounds
            )
          ) {
            tempId = i + offset;
            break;
          }
        }

        //find neighbours
        const neighbours = [];
        const remainder = tempId % 9;
        const startNumber = tempId - remainder;
        for (let i = 0; i < 9; i++) neighbours.push(startNumber + i);

        if (intersection(allRooms, neighbours).length)
          return this.createRoomNode(tempId);

        offset += maxRoomId;
      }
      //create new one
      // const roomId = getRoomIdByRoomNumber(roomNumber);
      // const newRoom : RoomItem = {
      //   id: roomId,
      //   roomNumber: roomNumber,
      //   roomType: RoomTypes.Zone,
      //   roomData: initialRoomData,
      //   onlineUsers: 1,
      // }
      // this._addRoomsToTree([roomId]);
      // this._list.push(newRoom);
      // this._idList.push(roomId);
      // return newRoom;
    } else {
      console.log("WTF");
      console.log(roomsResult);
    }
  }
}

//utils methods
const normilizeListRoom = (listRooms: RoomInfoType[]) => {
  return listRooms.map((item) => {
    const roomNumber = getRoomNumberById(item.id);
    return {
      ...item,
      roomNumber: roomNumber,
      ...RoomMath.getFramePoint(roomNumber),
    };
  }) as RoomItem[];
};

const getRoomIdByRoomNumber = (roomNumber: number) => {
  return ROOM_PREFIX + roomNumber;
};

const getRoomNumberById = (id: string) => {
  return parseInt(
    id.includes(MIRROR_ROOM_PREFIX)
      ? id.slice(MIRROR_ROOM_PREFIX.length)
      : id.slice(ROOM_PREFIX.length)
  );
};

// const isMirror = (name: string) => {
//   return name[0] === "m";
// };
