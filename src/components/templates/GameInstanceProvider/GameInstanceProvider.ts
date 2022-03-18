import { ReplicatedUser } from "store/reducers/AnimateMap";

import { Room } from "types/rooms";
import { Point } from "types/utility";

import { GameConfig } from "../AnimateMap/configs/GameConfig";
import { DataProvider } from "../DataProvider";

export type GameInstanceProvider = {
  config: GameConfig;
  dataProvider: DataProvider;
  containerElement: HTMLDivElement;
  handleSetAnimateMapFirstEntrance: (firstEntrance: string) => void;
  handleSetAnimateMapUsers: (users: Map<string, ReplicatedUser>) => void;
  handleSetAnimateMapRoom: (room: Room) => void;
  handleSetAnimateMapFireBarrel: (firebarrelId: string) => void;
  handleSetAnimateMapPointer: (pointer: Point) => void;
  handleSetAnimateMapZoom: (value: number) => void;
  handleSetAnimateMapLastZoom: (lastZoom: number) => void;
  animatemap: any; //TODO: найти какой тип нужен
}
