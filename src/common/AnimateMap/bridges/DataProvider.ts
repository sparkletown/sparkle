/**
 * Usage interfaces for GameInstance class
 */
import { ReplicatedVenue } from "common/AnimateMapStore/reducers";

import { Point } from "types/utility";

type ListenerFn = (...args: unknown[]) => void;

export interface DataProvider {
  on(eventName: string, callback: ListenerFn, context?: object): void;

  off(eventName: string, callback: ListenerFn): void;

  // eslint-disable-next-line
  // emit(eventName: string, props: any): void;

  update(dt: number): void;

  release: () => void;

  venuesData: ReplicatedVenue[];

  // player
  player: PlayerDataProviderInterface;
  // initPlayerPositionAsync: (x: number, y: number) => Promise<boolean | void>;
  setPlayerPosition: (x: number, y: number) => void;
}

export interface PlayerDataProviderInterface {
  isReady: () => boolean;
  position: Point;
  id: string;
}
