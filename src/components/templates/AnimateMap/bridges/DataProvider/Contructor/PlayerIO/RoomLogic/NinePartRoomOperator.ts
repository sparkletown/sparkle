export const ROOM_PREFIX = "Z_";
export const MIRROR_ROOM_PREFIX = "mZ_";

export interface RoomData {
  a: number; // x-coord of rect top-left point
  b: number; // y-coord of rect top-left point
  c: number; // x-coord of rect bottom-right point
  d: number; // y-coord of rect bottom-right point
}

export interface RoomNode {
  id: number;
  name: string;
  data: RoomData;
}

export class NinePartRoomOperator {
  protected _virtualList: RoomNode[] = [];

  protected constructor(listRooms: RoomData[]) {
    // listRooms.forEach(room => this._virtualList.push({id:0,name:"",}))
  }

  //general logic
  updateList(listRooms: RoomData[]) {
    //TODO: check all
  }

  getMyMainRoom(x: number, y: number) {
    if (!this._virtualList.length) return NinePartRoomOperator.getRoomName(0);

    const mainRooms = this._virtualList.filter(
      (room) =>
        x >= room.data.a &&
        y >= room.data.b &&
        x <= room.data.c &&
        y <= room.data.d
    );

    let name = "";
    switch (mainRooms.length) {
      case 0: //todo: create new room
        break;
      case 1: //todo: just join
        name = mainRooms[0].name;
        break;
      default:
        //todo: mirrors or cross-point
        // if (mainRooms.filter(room => NinePartRoomOperator.isMirror(room.name)).length) {
        //   //mirrors
        //
        // } else {
        //   //cross_point
        //
        // }
        break;
    }
    return name;
  }

  getMyPeripheralRoom() {}

  //utils methods
  protected static getRoomName(id: number) {
    return ROOM_PREFIX + id;
  }

  protected static isMirror(name: string) {
    return name[0] === "m";
  }

  // "magic" methods for overloading
  protected onCreate() {
    throw new Error("need implementation");
  }

  protected onJoin() {
    throw new Error("need implementation");
  }

  protected onLeave() {
    throw new Error("need implementation");
  }
}
