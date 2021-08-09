import { Sprite } from "pixi.js";

export class TooltipComponent {
  public view: Sprite | null = null;

  public textColor = 0xede8fe;
  public textSize = 14;
  public borderThikness = 3;
  public borderColor = 0x9178f6;
  public backgroundColor = 0x6943f5;

  constructor(
    public text: string = "default tooltip",
    public collisionRadius = 50,
    public position: string = "bottom"
  ) {}
}
