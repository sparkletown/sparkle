import { InteractionEvent } from "pixi.js";

export class ClickableSpriteComponent {
  constructor(public click?: (event: InteractionEvent) => void) {}
}
