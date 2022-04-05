import { Point } from "types/utility";

export type GameServerProviderInterface = {
  sendPlayerPosition: (x: number, y: number) => void;
  sendShoutMessage: (shout: string) => void;
  savePlayerPosition: (position: Point) => void;
};
