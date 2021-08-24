import { ExtendedFirebaseInstance } from "react-redux-firebase";
import { utils } from "pixi.js";

import { DEFAULT_AVATAR_IMAGE } from "settings";

import { ReplicatedVenue } from "../../../../../store/reducers/AnimateMap";
import { UseRelatedPartymapRoomsData } from "../../hooks/useRelatedPartymapRooms";
import { DataProvider } from "../DataProvider";

import { CommonInterface, CommonLinker } from "./Contructor/CommonInterface";
import { FirebaseDataProvider } from "./Contructor/Firebase/FirebaseDataProvider";
import { PlayerIOBots } from "./Contructor/PlayerIO/PlayerIOBots";
import { PlayerIODataProvider } from "./Contructor/PlayerIO/PlayerIODataProvider";
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
  public async initPlayerPositionAsync(x: number, y: number) {
    //TODO: REWORK
    return this.player.initPositionAsync(x, y);
  }

  public setPlayerPosition(x: number, y: number) {
    this.player.setPosition(x, y);
  }

  public venuesData: ReplicatedVenue[] = [];

  public updateRooms(data: UseRelatedPartymapRoomsData) {
    if (!data) return;

    const newVenues = data.filter(
      (item) => !this.venuesData.find((venue) => venue.data.url === item.url)
    );
    newVenues.forEach((room) => {
      console.log("create venue");
      const vn = {
        x: (room.x_percent / 100) * 9920 + 50, //TODO: refactor configs and throw data to here
        y: (room.y_percent / 100) * 9920 + 50,
        data: {
          ...room,
        },
      } as ReplicatedVenue;
      this.venuesData.push(vn);
      this.emit(DataProviderEvent.VENUE_ADDED, vn);
    });
  }
}
