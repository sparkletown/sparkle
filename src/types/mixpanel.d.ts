export declare interface People {
  set(data: Object): void;
}

export declare interface Mixpanel {
  init(token: string, opts?: Object): Mixpanel;
  identify(id: string): void;
  register(data: Object): void;
  people: People;
  track(eventName: string, data: Object): void;
  getProperty(propertyName: string): string;
  reset(): void;
  mute(): void;
  unmute(): void;
}

declare global {
  interface Window {
    mixpanel: Mixpanel;
  }
}
