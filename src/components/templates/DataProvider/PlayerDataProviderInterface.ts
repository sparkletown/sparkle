import { Point } from "types/utility";

export interface PlayerDataProviderInterface {
  isReady: () => boolean;
  position: Point;
  id: string;
}
