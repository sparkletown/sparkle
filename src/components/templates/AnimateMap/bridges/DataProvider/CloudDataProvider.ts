import { ExtendedFirebaseInstance } from "react-redux-firebase";
import { utils } from "pixi.js";

import { DEFAULT_AVATAR_IMAGE } from "settings";

import { ReplicatedVenue } from "store/reducers/AnimateMap";

import { DataProvider } from "../DataProvider";

import {
  CommonInterface,
  CommonLinker,
  MessageType,
} from "./Contructor/CommonInterface";
import { FirebaseDataProvider } from "./Contructor/FirebaseDataProvider";
import { PlayerIODataProvider } from "./Contructor/PlayerIODataProvider";
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

  constructor(
    readonly playerId: string,
    readonly userAvatarUrl: string | undefined,
    firebase: ExtendedFirebaseInstance,
    readonly playerioGameId?: string
  ) {
    super();

    playerModel.data.avatarUrlString = userAvatarUrl ?? DEFAULT_AVATAR_IMAGE;
    playerModel.id = playerId;

    this.commonInterface = new CommonLinker(
      new PlayerIODataProvider(playerId, (connection) => {
        connection.addMessageCallback("Join", (m) => {
          // @ts-ignore
          const sessionId = m.getInt(0) as number;
          // @ts-ignore
          const userId = m.getString(1) as string;
          this.users.join(sessionId, userId);
          if (userId === this.playerId) {
            this.player.sessionId = sessionId;
          } else {
            this.emit(DataProviderEvent.USER_JOINED, userId);
          }
        });

        connection.addMessageCallback("Left", (m) => {
          // @ts-ignore
          const sessionId = m.getInt(0) as number;
          const userId = this.users.users.getId(sessionId);
          this.users.left(sessionId);
          this.emit(DataProviderEvent.USER_LEFT, userId);
        });

        connection.addMessageCallback(MessageType.move, (m) => {
          // @ts-ignore
          const sessionId = m.getInt(0) as number;
          // @ts-ignore
          const x = m.getInt(1) as number;
          // @ts-ignore
          const y = m.getInt(2) as number;
          // @ts-ignore
          const userId = m.getString(3) as string;
          if (userId === this.playerId) return; //reject

          const isNewUser = this.users.update(sessionId, x, y, userId);
          if (isNewUser) {
            this.emit(DataProviderEvent.USER_JOINED, userId);
            this.emit(DataProviderEvent.USER_MOVED, userId, x, y);
          } else {
            this.emit(DataProviderEvent.USER_MOVED, userId, x, y);
          }
        });
      }),
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
      this.update(0);
    }
  }

  public release() {
    this.player.release();
  }

  // player provider
  public async initPlayerPositionAsync(x: number, y: number) {
    this.commonInterface
      .loadVenuesAsync() //@ts-ignore
      .then((q) => {
        //@ts-ignore
        q.forEach((doc) => {
          const data = doc.data();
          console.log(data);
          const vn = {
            x: data.animatemap.x,
            y: data.animatemap.y,
            data: {
              url: "/in/" + doc.id,
              videoUrlString: "",
              imageUrlString: data?.host?.icon,
            },
          } as ReplicatedVenue;
          this.emit(DataProviderEvent.VENUE_ADDED, vn);
        });
      }) //@ts-ignore
      .catch((error) => console.log(error));
    return this.player.initPositionAsync(x, y);
  }

  public setPlayerPosition(x: number, y: number) {
    this.player.setPosition(x, y);
  }
}
