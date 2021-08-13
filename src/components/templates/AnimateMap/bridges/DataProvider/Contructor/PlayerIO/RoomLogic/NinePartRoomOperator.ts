import { Point } from "types/utility";

import {
  RoomInfoType,
  RoomItem,
  RoomsModel,
} from "../../../Structures/RoomsModel";

export abstract class NinePartRoomOperator {
  protected _roomsModel;

  protected _myRooms: RoomItem[] = [];

  protected _myMainRoom?: RoomItem;
  protected _myPeripheralRoom: RoomItem[] = [];

  protected _userPosition: Point = { x: -100, y: -100 };

  set position(point: Point) {
    this._userPosition.x = point.x;
    this._userPosition.y = point.y;
  }

  get position() {
    return { ...this._userPosition };
  }

  protected constructor(/*listRooms: RoomInfoType[],*/ playerPosition: Point) {
    this.position = playerPosition;
    this._roomsModel = new RoomsModel(9920, 9920); //TODO: throw sizes from configs
    // this.initlist(listRooms);
  }

  //general logic

  // public initlist(listRooms: RoomInfoType[]) {
  //   this.update(listRooms, true);
  // }

  update(listRooms: RoomInfoType[], hardUpdate = false) {
    this._roomsModel.updateList(listRooms);
    this._updateMainRoom();
    this._updatePeripheralRoom();
  }

  protected _updateMainRoom() {
    if (this.position.x < 0 || this.position.y < 0) return; //todo: add checking with bounds ?

    if (!this._roomsModel.size) {
      this._myMainRoom = this._roomsModel.createRoomNode(0);
      this.onCreate.call(this, this._myMainRoom.id, true); //note: создаем комнату
      return;
    }

    const roomByPoint = this._roomsModel.getRoomByPoint(this.position);
    if (roomByPoint) {
      console.log("Room by point ", roomByPoint.id);
      this.onCreate.call(this, roomByPoint.id, true);
    } else console.warn(roomByPoint);
  }

  protected changeMainRoom(id: string) {}

  protected _updatePeripheralRoom() {
    if (this.position.x < 0 || this.position.y < 0) return; //reject
  }

  getMyMainRoomNode(x = this.position.x, y = this.position.y) {
    // const mainRooms = this._roomsModel.list.filter(
    //   (room) => true
    // x >= room.roomData.a &&
    // y >= room.data.b &&
    // x <= room.data.c &&
    // y <= room.data.d
    // );
    // let name = "";
    // switch (mainRooms.length) {
    //   case 0: //todo: create new room
    //     break;
    //   case 1: //todo: just join
    //     name = mainRooms[0].roomNumber +"";
    //     break;
    //   default:
    //     //todo: mirrors or cross-point
    //     // if (mainRooms.filter(room => NinePartRoomOperator.isMirror(room.name)).length) {
    //     //   //mirrors
    //     //
    //     // } else {
    //     //   //cross_point
    //     //
    //     // }
    //     break;
    // }
    // return name;
  }

  // protected createRoomNode(roomNumber: number) {
  //   const room : RoomItem = {
  //     roomNumber: roomNumber,
  //     id: NinePartRoomOperator.getRoomIdByRoomNumber(roomNumber),
  //     roomData: initialRoomData,
  //     roomType: RoomTypes.Zone,
  //     onlineUsers: 0,
  //   }
  //   return room;
  // }

  getMyPeripheralRoom() {}

  // "magic" methods for overloading
  abstract onCreate(id: string, isMain: boolean): void;

  abstract onJoin(id: string): void;

  abstract onLeave(id: string): void;
}
