import { utils } from "pixi.js";

export class Model extends utils.EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public attributes: Map<string, any> = new Map<string, any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(attributes: any = {}) {
    super();

    this.set(attributes);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set(keyOrAttributes: string | any, value: any | null = null): void {
    const changed = new Map();

    if (typeof keyOrAttributes === "string") {
      if (this.attributes.get(keyOrAttributes) === value) return; //reject

      this.attributes.set(keyOrAttributes, value);
      changed.set(keyOrAttributes, value);

      this.emit("change:" + keyOrAttributes, { changed });
    } else {
      Object.keys(keyOrAttributes).forEach((key) => {
        this.attributes.set(key, keyOrAttributes[key]);
        changed.set(key, keyOrAttributes[key]);
      });

      Object.keys(keyOrAttributes).forEach((key) => {
        this.emit("change:" + key, { changed });
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get(key: string): any | null {
    if (this.attributes.has(key)) {
      return this.attributes.get(key);
    }

    return null;
  }
}
