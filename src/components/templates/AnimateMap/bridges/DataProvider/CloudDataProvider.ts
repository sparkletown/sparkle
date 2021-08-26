import { ExtendedFirebaseInstance } from "react-redux-firebase";
import { utils } from "pixi.js";

import { DEFAULT_AVATAR_IMAGE } from "settings";

import { ReplicatedUser, ReplicatedVenue } from "store/reducers/AnimateMap";

import { Room } from "types/rooms";

import { WithVenue } from "utils/venue";

import { WorldUsersData } from "hooks/users/useWorldUsers";

import { RoomWithFullData } from "../CloudDataProviderWrapper";
import { DataProvider } from "../DataProvider";

import { CommonInterface, CommonLinker } from "./Contructor/CommonInterface";
import { FirebaseDataProvider } from "./Contructor/Firebase/FirebaseDataProvider";
import { PlayerIOBots } from "./Contructor/PlayerIO/PlayerIOBots";
import { PlayerIODataProvider } from "./Contructor/PlayerIO/PlayerIODataProvider";
import { getIntByHash } from "./Contructor/PlayerIO/utils/getIntByHash";
import { DataProviderEvent } from "./Providers/DataProviderEvent";
import { PlayerDataProvider } from "./Providers/PlayerDataProvider";
import { UsersDataProvider } from "./Providers/UsersDataProvider";
import playerModel from "./Structures/PlayerModel";

const FREQUENCY_UPDATE = 0.02; //per second

/**
 * Dirty class, for initiating all general data bridge logic
 */
export class CloudDataProvider
  extends utils.EventEmitter
  implements DataProvider {
  private _updateCounter = 0;
  private _maxUpdateCounter = 1 / FREQUENCY_UPDATE;

  readonly player: PlayerDataProvider;
  readonly users: UsersDataProvider;
  readonly commonInterface: CommonInterface;

  /**
   * Update frequency (per second)
   */
  private _frequencyUpdate = FREQUENCY_UPDATE;
  get frequencyUpdate() {
    return this._frequencyUpdate;
  }

  set frequencyUpdate(value) {
    this._frequencyUpdate = value;
    this._maxUpdateCounter = 1 / value;
  }

  private _testBots;

  constructor(
    readonly playerId: string,
    readonly userAvatarUrl: string | undefined,
    firebase: ExtendedFirebaseInstance,
    readonly playerioGameId: string
  ) {
    super();

    this._testBots = new PlayerIOBots(this.playerioGameId ?? "");
    //window.ADD_IO_BOT = this._testBots.addBot.bind(this._testBots); //TODO: remove later

    playerModel.data.avatarUrlString = userAvatarUrl ?? DEFAULT_AVATAR_IMAGE;
    playerModel.data.id = playerId;

    this.commonInterface = new CommonLinker(
      new PlayerIODataProvider(
        playerioGameId ?? "",
        playerId,
        (connection) => {}
      ), //TODO: remove callback
      new FirebaseDataProvider(firebase)
    );
    this.player = new PlayerDataProvider(playerId, this.commonInterface);
    this.users = new UsersDataProvider(this.commonInterface);
  }

  public update(dt: number) {
    this._updateCounter += dt;
    if (this._updateCounter > this._maxUpdateCounter) {
      this._updateCounter -= this._maxUpdateCounter;
      this.player.updatePosition();
      this._testBots.update();
      this.update(0);
    }
  }

  public release() {
    this.player.release();
  }

  // player provider
  // public async initPlayerPositionAsync(x: number, y: number) {
  //   //TODO: REWORK
  //   return this.player.initPositionAsync(x, y);
  // }

  public setPlayerPosition(x: number, y: number) {
    this.player.setPosition(x, y);
  }

  public venuesData: ReplicatedVenue[] = [];

  public updateRooms(
    data: RoomWithFullData<WithVenue<Room> | Room>[] | undefined
  ) {
    if (!data) return;

    const newVenues = data.filter(
      (item) => !this.venuesData.find((venue) => venue.data.id === item.id)
    );
    console.log(newVenues);

    const deprecatedVenues = this.venuesData.filter(
      (item) => !data.find((room) => room.id === item.data.id)
    );
    console.log(deprecatedVenues);
    deprecatedVenues.forEach((venue) =>
      this.emit(DataProviderEvent.VENUE_REMOVED, venue)
    );
    this.venuesData = this.venuesData.filter(
      (venue) => !deprecatedVenues.find((v) => v.data.id === venue.data.id)
    );

    const existedVenues = this.venuesData.filter((venue) => {
      const room = data.find((room) => room.id === venue.data.id);

      if (!room) return false;

      return !(
        room.url === venue.data.url &&
        room.title === venue.data.title &&
        room.subtitle === venue.data.subtitle &&
        room.image_url === venue.data.image_url &&
        room.isLive === venue.data.isLive &&
        room.countUsers === venue.data.usersCount &&
        room.isEnabled === venue.data.isEnabled
      );
    });
    console.log(existedVenues);
    // eslint-disable-next-line no-debugger
    if (existedVenues.length > 20) debugger;
    existedVenues.forEach((venue) =>
      this.emit(DataProviderEvent.VENUE_UPDATED, venue)
    );

    newVenues.forEach((room) => {
      const usersCount = "countUsers" in room ? room.countUsers : 0;
      const vn = {
        x: (room.x_percent / 100) * 9920 + 50, //TODO: refactor configs and throw data to here
        y: (room.y_percent / 100) * 9920 + 50,
        data: {
          usersCount: usersCount,
          ...room,
        },
      } as ReplicatedVenue;
      this.venuesData.push(vn);
      this.emit(DataProviderEvent.VENUE_ADDED, vn);
    });
  }

  // public usersData: ReplicatedUser[] = []
  private countersForVenue = new Map<string, number>();

  private isUpdateUsersLocked = false;

  public async updateUsersAsync(data: WorldUsersData) {
    if (this.isUpdateUsersLocked) return;

    this.isUpdateUsersLocked = true;
    await this.updateUsers(data);
    this.isUpdateUsersLocked = false;
  }

  public updateUsers(data: WorldUsersData) {
    if (!data?.isWorldUsersLoaded) return;

    // new entities scenario
    const usersData: ReplicatedUser[] = [];
    data.worldUsers.forEach((user) => {
      // if (user.lastSeenIn) //todo: add counter

      usersData.push({
        x: -1000,
        y: -1000,
        data: {
          id: user.id,
          messengerId: getIntByHash(user.id),
          avatarUrlString: user.pictureUrl ?? "",
          videoUrlString: "",
          dotColor: 0xabfcfb,
        },
      });
    });

    //TODO: update scenario

    // todo: add normalization
    this.users.updateUsers(usersData);
  }
}
