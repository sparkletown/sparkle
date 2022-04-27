import { AnimateMapPoint, AnimateMapVenue } from "common/AnimateMapCommon";

type ListenerFn = (...args: unknown[]) => void;

export interface DataProvider {
  on(eventName: string, callback: ListenerFn, context?: object): void;

  off(eventName: string, callback: ListenerFn): void;

  // eslint-disable-next-line
  // emit(eventName: string, props: any): void;

  update(dt: number): void;

  release: () => void;

  venuesData: AnimateMapVenue[];

  // player
  player: PlayerDataProviderInterface;
  // initPlayerPositionAsync: (x: number, y: number) => Promise<boolean | void>;
  setPlayerPosition: (x: number, y: number) => void;
}

export interface PlayerDataProviderInterface {
  isReady: () => boolean;
  position: AnimateMapPoint;
  id: string;
}
