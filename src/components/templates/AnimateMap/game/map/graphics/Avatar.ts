import { Sprite } from "pixi.js";

export class Avatar extends Sprite {
  public halo: Sprite | null = null;
  public cycle: Sprite | null = null;
  public avatar: Sprite | null = null;
  public accessories: Sprite | null = null;
  public hat: Sprite | null = null;
}
