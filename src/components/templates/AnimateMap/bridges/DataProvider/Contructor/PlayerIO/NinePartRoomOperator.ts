const D = 3; // dimension in line
const DD = 9; // dimension in square
const MAX_DEPTH = 9;
// const W = 39366;
// const H = 39366;

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

  protected static getFramePoint(id: number) {
    let relativeId = id;
    let depth = 0;
    let dif = Math.pow(D, depth);

    while (depth <= MAX_DEPTH && relativeId - dif >= 0) {
      relativeId -= dif;
      depth++;
    }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFramePoint(id: number) {
  id = id - 1;

  let relativeId = id;
  let depth = 0;
  let dif = Math.pow(DD, depth);

  while (depth <= 9 && relativeId - dif >= 0) {
    relativeId -= dif;
    depth++;
    dif = Math.pow(DD, depth);
  }

  // const width = W / Math.pow(3, depth);
  // const height = width;

  let id_j = id.toString(D);
  let parentalForColumn_j = "1";
  for (let j = 2, i = id_j.length - 2; i >= 0; i--, j++) {
    parentalForColumn_j = (j % 2 !== 0 ? 0 : id_j[i]) + parentalForColumn_j;
  }
  parentalForColumn_j = parseInt(parentalForColumn_j, D).toString(D);

  const length = parentalForColumn_j.length;
  const parentalForColumn = parseInt(parentalForColumn_j, D);
  const min = Math.pow(D, length / 2 - 1) + 1;
  const max = Math.pow(D, length / 2);

  const column = getMagicColumn(parentalForColumn_j, min, max);
  const offset = id - parentalForColumn + 1;
  const parentalForRow_j = offset.toString(D);
  const length2 = parentalForRow_j.length;

  const min2 = Math.pow(D, (length2 - 1) / 2) + 1;
  const max2 = Math.pow(D, (length2 - 1) / 2 + 1);

  const row = getMagicColumn(parentalForRow_j, min2, max2);
  return [row, column]; //TODO: convert to rect
}

//@ts-ignore
function getMagicColumn(parental: string, min: number, max: number, i = 0) {
  if (min === max) return min; //find!
  if (parental.length < i) throw new Error("WTF2");

  const p = parental[i];

  //exception case;
  if (i === 0) {
    if (p === "1") {
      max = max - (max - min + 1) / 2;
      return getMagicColumn(parental, min, max, i + 2);
    } else if (p === "2") {
      min = min + (max - min + 1) / 2;
      return getMagicColumn(parental, min, max, i + 2);
    } else throw new Error("WTF");
  }

  //usual case
  switch (p) {
    case "0":
      max = max - (2 * (max - min + 1)) / D;
      break;
    case "1":
      const oldMin = min;
      min = min + (max - min + 1) / D;
      max = max - (max - oldMin + 1) / D;
      break;
    case "2":
      min = min + (2 * (max - min + 1)) / D;
      break;
  }
  return getMagicColumn(parental, min, max, i + 2);
}
