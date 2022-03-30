import { Point } from "types/utility";

export interface PlayerDataProviderInterface {
  isReady: () => boolean;
  position: Point;
  id: string;
  updatePosition: () => void;
  sendPosition: () => void;
  setPosition: (x: number, y: number) => void;
  release: () => void;
}
