import { Sprite } from "pixi.js";

export class SpriteComponent {
  static HALO = "halo";
  static CYCLE = "cycle";
  static AVATAR = "avatar";
  static ACCESSORIES = "accessories";
  static HAT = "hat";

  public view!: Sprite;

  constructor(public imageUrl: string = "") {}
}
