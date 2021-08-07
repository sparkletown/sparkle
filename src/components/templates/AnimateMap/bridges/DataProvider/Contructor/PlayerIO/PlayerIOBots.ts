import { getRandomInt } from "utils/getRandomInt";
import { throttle } from "lodash";
import { MessagesTypes, PlayerIODataProvider } from "./PlayerIODataProvider";
import { connection } from "../../../../vendors/playerio/PlayerIO";
import { getRandomBotId } from "./utils/getRandomBotId";
import { getIntByHash } from "./utils/getIntByHash";

const dV_max = 200;
const world_width = 9920;
const world_height = 9920;

export class PlayerIOBots {
  private _bots: Bot[] = [];

  addBot() {
    this._bots.push(
      new Bot(
        getRandomBotId(28),
        getRandomInt(world_width),
        getRandomInt(world_height)
      )
    );
  }

  removeBot() {
    this._bots.pop()?.closeConnection();
  }

  update() {
    this._bots.forEach((bot) => bot.update());
  }
}

class Bot {
  private _throttledUpdatePosition: Function;
  private _playerio: PlayerIODataProvider<object>;
  private _playerioConnection: connection | undefined;
  private _shortId = getIntByHash(this.id);

  constructor(readonly id: string, public x: number, public y: number) {
    this._throttledUpdatePosition = throttle(
      this._updatePosition.bind(this),
      2000
    );

    this._playerio = new PlayerIODataProvider(id, (connection) => {
      this._playerioConnection = connection;
      if (this._closed) this.closeConnection();
    });
  }

  update() {
    this._throttledUpdatePosition();
  }

  private _closed = false;

  closeConnection() {
    this._closed = true;
    this._playerioConnection?.disconnect();
  }

  private _updatePosition() {
    if (getRandomInt(1)) this.x += getRandomInt(dV_max);
    else this.x -= getRandomInt(dV_max);

    if (getRandomInt(1)) this.y += getRandomInt(dV_max);
    else this.y -= getRandomInt(dV_max);

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x > world_width) this.x = world_width;
    if (this.x > world_height) this.x = world_height;

    console.log(MessagesTypes.move, this._shortId, this.x, this.y, this.id);
    this._playerio.sendPlayerPosition(
      MessagesTypes.move,
      this._shortId,
      this.x,
      this.y,
      this.id
    );
  }
}
