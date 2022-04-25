import { Sprite } from "pixi.js";

import { Hoverable } from "./Hoverable";

export class Venue extends Sprite implements Hoverable {
  public halo?: Sprite;
  public main?: Sprite;
}
