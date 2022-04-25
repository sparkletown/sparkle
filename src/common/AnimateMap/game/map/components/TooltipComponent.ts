import { Sprite } from "pixi.js";

export class TooltipComponent {
  public view?: Sprite;

  public textColor = 0xede8fe;
  public textSize = 14;
  public borderThikness = 0;
  public borderColor = 0x9178f6;
  public backgroundColor = 0x6943f5;

  constructor(
    public text = "default tooltip",
    public collisionRadius = 50,
    public position = "bottom"
  ) {}
}
