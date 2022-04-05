import { utils } from "pixi.js";

import {
  ReplicatedUser,
  ReplicatedVenue,
} from "../GameInstanceCommonInterfaces";
import { RoomPointNode } from "../GameStructures";

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
  SEND_SHOUT = "EventProviderType.SEND_SHOUT",
  RECEIVE_SHOUT = "EventProviderType.RECEIVE_SHOUT",
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
type UserJoinedCallback = (user: ReplicatedUser) => void;
type UserLeftCallback = (user: ReplicatedUser) => void;
type UserMovedCallback = (user: ReplicatedUser) => void;
type SendShoutCallback = (msg: string) => void;
type ReceiveShoutCallback = (playerId: string, msg: string) => void;

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
  on(type: EventType.SEND_SHOUT, callback: SendShoutCallback): this;
  on(type: EventType.RECEIVE_SHOUT, callback: ReceiveShoutCallback): this;

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
  emit(
    type: EventType.SEND_SHOUT,
    ...params: Parameters<SendShoutCallback>
  ): boolean;
  emit(
    type: EventType.RECEIVE_SHOUT,
    ...params: Parameters<ReceiveShoutCallback>
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

export const EventProvider = EventProviderSingleton.getInstance();
