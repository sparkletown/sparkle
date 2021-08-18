import { Sprite } from "pixi.js";

export class SpriteComponent {
  public view!: Sprite;

  constructor(public imageUrl: string = "") {}
}
