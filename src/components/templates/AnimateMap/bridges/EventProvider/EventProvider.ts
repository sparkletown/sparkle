import { utils } from "pixi.js";

import { ReplicatedUser, ReplicatedVenue } from "store/reducers/AnimateMap";

export enum EventType {
  SOME_COOL_EVENT = "EventProviderType.SOME_COOL_EVENT", //TODO: remove examples events later
  SOME_BAD_EVENT = "EventProviderType.SOME_BAD_EVENT", //TODO: remove examples events later

  UI_CONTROL_PANEL_ZOOM_IN = "EventProviderType.UI_CONTROL_PANEL_ZOOM_IN",
  UI_CONTROL_PANEL_ZOOM_OUT = "EventProviderType.UI_CONTROL_PANEL_ZOOM_OUT",
  UI_SINGLE_BUTTON_FOLLOW = "EventProviderType.UI_SINGLE_BUTTON_FOLLOW",

  ON_ROOMS_CHANGED = "EventProviderType.ON_ROOMS_CHANGED",

  ON_VENUE_COLLISION = "EventProviderType.ON_VENUE_COLLISION",

  PLAYER_MODEL_READY = "EventProviderType.PLAYER_MODEL_READY",

  USER_JOINED = "EventProviderType.USER_JOINED",
  USER_LEFT = "EventProviderType.USER_LEFT",
  USER_MOVED = "EventProviderType.USER_MOVED",
  // VENUE_ADDED = "EventProviderType.VENUE_DATA",
}

type SomeCoolEventCallback = (answer: 42) => void;
type SomeBadEventCallback = (error: Error, message: string) => void;
type OnVenueCollisionCallback = (venue: ReplicatedVenue) => void;
type PlayerModelReadyCallback = (player: ReplicatedUser) => void;

type UserJoinedCallback = (playerId: number, x: number, y: number) => void;
type UserLeftCallback = (playerId: number) => void;
type UserMovedCallback = (playerId: number, x: number, y: number) => void;
// type UserJoinedCallback = (player: ReplicatedUser) => void;

export declare interface EventProviderSingleton {
  on(type: EventType.SOME_COOL_EVENT, callback: SomeCoolEventCallback): this;

  emit(
    type: EventType.SOME_COOL_EVENT,
    ...params: Parameters<SomeCoolEventCallback>
  ): boolean;

  on(type: EventType.SOME_BAD_EVENT, callback: SomeBadEventCallback): this;

  emit(
    type: EventType.SOME_BAD_EVENT,
    ...params: Parameters<SomeBadEventCallback>
  ): boolean;

  on(type: EventType.ON_ROOMS_CHANGED, callback: () => void): this;

  emit(type: EventType.ON_ROOMS_CHANGED): boolean;

  on(type: EventType.UI_CONTROL_PANEL_ZOOM_IN, callback: () => void): this;

  emit(type: EventType.UI_CONTROL_PANEL_ZOOM_IN): boolean;

  on(type: EventType.UI_CONTROL_PANEL_ZOOM_IN, callback: () => void): this;

  emit(type: EventType.UI_CONTROL_PANEL_ZOOM_IN): boolean;

  on(type: EventType.UI_CONTROL_PANEL_ZOOM_OUT, callback: () => void): this;

  emit(type: EventType.UI_CONTROL_PANEL_ZOOM_OUT): boolean;

  on(type: EventType.UI_SINGLE_BUTTON_FOLLOW, callback: () => void): this;

  emit(type: EventType.UI_SINGLE_BUTTON_FOLLOW): boolean;

  on(
    type: EventType.ON_VENUE_COLLISION,
    callback: OnVenueCollisionCallback
  ): this;

  emit(
    type: EventType.ON_VENUE_COLLISION,
    ...params: Parameters<OnVenueCollisionCallback>
  ): boolean;

  on(
    type: EventType.PLAYER_MODEL_READY,
    callback: PlayerModelReadyCallback
  ): this;

  emit(
    type: EventType.PLAYER_MODEL_READY,
    ...params: Parameters<PlayerModelReadyCallback>
  ): boolean;

  on(type: EventType.USER_JOINED, callback: UserJoinedCallback): this;

  emit(
    type: EventType.USER_JOINED,
    ...params: Parameters<UserJoinedCallback>
  ): boolean;

  on(type: EventType.USER_LEFT, callback: UserLeftCallback): this;

  emit(
    type: EventType.USER_LEFT,
    ...params: Parameters<UserLeftCallback>
  ): boolean;

  on(type: EventType.USER_MOVED, callback: UserMovedCallback): this;

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
