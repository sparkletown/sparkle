import { Sprite } from "pixi.js";

import { Hoverable } from "./Hoverable";

export class Firebarrel extends Sprite implements Hoverable {
  public halo?: Sprite;
  public main?: Sprite;
  public avatars?: Sprite;
  public camIcon?: Sprite;
}
