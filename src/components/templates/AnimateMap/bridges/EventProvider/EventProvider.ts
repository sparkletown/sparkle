import { utils } from "pixi.js";

import { ReplicatedUser, ReplicatedVenue } from "store/reducers/AnimateMap";

import { RoomPointNode } from "../DataProvider/Structures/RoomsModel";

export enum EventType {
  ON_ROOMS_CHANGED = "EventProviderType.ON_ROOMS_CHANGED",

  ON_VENUE_COLLISION = "EventProviderType.ON_VENUE_COLLISION",

  PLAYER_MODEL_READY = "EventProviderType.PLAYER_MODEL_READY",

  ON_REPLICATED_USER_CLICK = "EventProviderType.ON_REPLICATED_USER_CLICK",

  // UI
  UI_CONTROL_PANEL_ZOOM_IN = "EventProviderType.UI_CONTROL_PANEL_ZOOM_IN",
  UI_CONTROL_PANEL_ZOOM_OUT = "EventProviderType.UI_CONTROL_PANEL_ZOOM_OUT",
  UI_SINGLE_BUTTON_FOLLOW = "EventProviderType.UI_SINGLE_BUTTON_FOLLOW",
  // playerio
  USER_JOINED = "EventProviderType.USER_JOINED",
  USER_LEFT = "EventProviderType.USER_LEFT",
  USER_MOVED = "EventProviderType.USER_MOVED",
}

type OnRoomsChangedCallback = (points: RoomPointNode[]) => void;

type OnVenueCollisionCallback = (venue: ReplicatedVenue) => void;
type PlayerModelReadyCallback = (player: ReplicatedUser) => void;

type OnPlayerClickCallback = (
  user: ReplicatedUser,
  viewportX: number,
  viewportY: number
) => void;

// playerio
type UserJoinedCallback = (playerId: number, x: number, y: number) => void;
type UserLeftCallback = (playerId: number) => void;
type UserMovedCallback = (playerId: number, x: number, y: number) => void;

export declare interface EventProviderSingleton {
  on(type: EventType.ON_ROOMS_CHANGED, callback: OnRoomsChangedCallback): this;
  on(
    type: EventType.ON_VENUE_COLLISION,
    callback: OnVenueCollisionCallback
  ): this;
  on(
    type: EventType.PLAYER_MODEL_READY,
    callback: PlayerModelReadyCallback
  ): this;

  // UI
  on(type: EventType.UI_CONTROL_PANEL_ZOOM_IN, callback: () => void): this;
  on(type: EventType.UI_CONTROL_PANEL_ZOOM_OUT, callback: () => void): this;
  on(type: EventType.UI_SINGLE_BUTTON_FOLLOW, callback: () => void): this;
  on(
    type: EventType.ON_REPLICATED_USER_CLICK,
    callback: OnPlayerClickCallback
  ): this;
  // playerio
  on(type: EventType.USER_JOINED, callback: UserJoinedCallback): this;
  on(type: EventType.USER_LEFT, callback: UserLeftCallback): this;
  on(type: EventType.USER_MOVED, callback: UserMovedCallback): this;

  emit(
    type: EventType.ON_ROOMS_CHANGED,
    ...params: Parameters<OnRoomsChangedCallback>
  ): boolean;
  emit(
    type: EventType.ON_VENUE_COLLISION,
    ...params: Parameters<OnVenueCollisionCallback>
  ): boolean;
  emit(
    type: EventType.PLAYER_MODEL_READY,
    ...params: Parameters<PlayerModelReadyCallback>
  ): boolean;
  emit(
    type: EventType.ON_REPLICATED_USER_CLICK,
    ...params: Parameters<OnPlayerClickCallback>
  ): boolean;

  //UI
  emit(type: EventType.UI_CONTROL_PANEL_ZOOM_OUT): boolean;
  emit(type: EventType.UI_SINGLE_BUTTON_FOLLOW): boolean;
  emit(type: EventType.UI_CONTROL_PANEL_ZOOM_IN): boolean;
  // playerio
  emit(
    type: EventType.USER_JOINED,
    ...params: Parameters<UserJoinedCallback>
  ): boolean;
  emit(
    type: EventType.USER_LEFT,
    ...params: Parameters<UserLeftCallback>
  ): boolean;
  emit(
    type: EventType.USER_MOVED,
    ...params: Parameters<UserMovedCallback>
  ): boolean;
}

export class EventProviderSingleton extends utils.EventEmitter {
  private static instance: EventProviderSingleton;

  private constructor() {
    super();
  }

  public static getInstance(): EventProviderSingleton {
    if (!EventProviderSingleton.instance) {
      EventProviderSingleton.instance = new EventProviderSingleton();
    }
    return EventProviderSingleton.instance;
  }
}

const EventProvider = EventProviderSingleton.getInstance();
export default EventProvider;
