import { utils } from "pixi.js";

import { ReplicatedVenue } from "store/reducers/AnimateMap";

export enum EventType {
  SOME_COOL_EVENT = "EventProviderType.SOME_COOL_EVENT", //TODO: remove examples events later
  SOME_BAD_EVENT = "EventProviderType.SOME_BAD_EVENT", //TODO: remove examples events later

  UI_CONTROL_PANEL_ZOOM_IN = "EventProviderType.UI_CONTROL_PANEL_ZOOM_IN",
  UI_CONTROL_PANEL_ZOOM_OUT = "EventProviderType.UI_CONTROL_PANEL_ZOOM_OUT",
  UI_SINGLE_BUTTON_FOLLOW = "EventProviderType.UI_SINGLE_BUTTON_FOLLOW",

  ON_VENUE_COLLISION = "EventProviderType.ON_VENUE_COLLISION",
}

type SomeCoolEventCallback = (answer: 42) => void;
type SomeBadEventCallback = (error: Error, message: string) => void;
type OnVenueCollisionCallback = (venue: ReplicatedVenue) => void;

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
