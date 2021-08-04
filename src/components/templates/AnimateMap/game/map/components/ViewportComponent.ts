import { Point } from "../../utils/Point";

export class ViewportComponent {
  constructor(
    public zoomLevel = 0, // [0, 1, 2]
    public zoomViewport = 1, // [1 - .1]
    public click: Point | null | undefined = null
  ) {}
}
