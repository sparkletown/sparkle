import { client } from "../PlayerIO";

import { ProxyBigDB } from "./ProxyBigDB";
import { ProxyMultiplayer } from "./ProxyMultiplayer";

export class ProxyClient {
  public multiplayer = new ProxyMultiplayer(this.originClient.multiplayer);
  public bigDB = new ProxyBigDB(this.originClient.bigDB);

  constructor(public originClient: client) {}
}
