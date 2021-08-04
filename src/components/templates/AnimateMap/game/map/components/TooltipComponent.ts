import { Sprite } from "pixi.js";

export class TooltipComponent {
  public view: Sprite | null = null;

  constructor(
    public text: string = "default tooltip",
    public collisionRadius = 50,
    public position: string = "bottom"
  ) {}
}
