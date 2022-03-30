/**
 * Usage interfaces for GameInstance class
 */
import { ReplicatedFirebarrel, ReplicatedVenue } from "store/reducers/AnimateMap";

import { DataProviderSettingInterface } from "./DataProviderSetting";
import { PlayerDataProviderInterface } from "./PlayerDataProviderInterface";
import { UsersDataProvider } from "./UsersDataProvider";

export interface DataProvider {

  settings: DataProviderSettingInterface;

  users: UsersDataProvider;

  on(eventName: string, callback: Function, context?: object): void;

  off(eventName: string, callback: Function): void;

  // eslint-disable-next-line
  // emit(eventName: string, props: any): void;

  update(dt: number): void;

  release: () => void;

  firebarrelsData: ReplicatedFirebarrel[];

  venuesData: ReplicatedVenue[];

  // player
  player: PlayerDataProviderInterface;
  // initPlayerPositionAsync: (x: number, y: number) => Promise<boolean | void>;
  setPlayerPosition: (x: number, y: number) => void;
}
