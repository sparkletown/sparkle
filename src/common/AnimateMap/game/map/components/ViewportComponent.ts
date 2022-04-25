import { GamePoint } from "../../common";

export class ViewportComponent {
  constructor(
    public zoomLevel = 0, // [0, 1, 2]
    public zoomViewport = 1, // [1 - .1]
    public click: GamePoint | null | undefined = null
  ) {}
}
