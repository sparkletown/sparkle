/* eslint-disable no-bitwise */
// import { EventProviderSingleton } from "../../bridges/EventProvider/EventProvider";

const WORD_SIZE = 32;

export class KeyPollSingleton {
  private keys: Int32Array = new Int32Array(4);

  private static instance: KeyPollSingleton;

  private constructor() {
    window.addEventListener("keyup", this.keyUpHandler);
    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("blur", this.windowBlurHandler.bind(this));
  }

  public static getInstance(): KeyPollSingleton {
    if (!KeyPollSingleton.instance) {
      KeyPollSingleton.instance = new KeyPollSingleton();
    }
    return KeyPollSingleton.instance;
  }

  public isDown(key: number): boolean {
    const i = Math.floor(key / WORD_SIZE);
    return (this.keys[i] & (1 << (key - i * WORD_SIZE))) !== 0;
  }

  public isUp(key: number): boolean {
    return !this.isDown(key);
  }

  private keyDownHandler = (event: KeyboardEvent) => {
    const { keyCode } = event;
    const index = Math.floor(keyCode / WORD_SIZE);
    this.keys[index] |= 1 << (keyCode - index * WORD_SIZE);
    this.keyEventHandlers
      .filter((item) => item.code === keyCode)
      .forEach((item) => item.callback("down"));
  };

  private keyUpHandler = (event: KeyboardEvent) => {
    const { keyCode } = event;
    const index = Math.floor(keyCode / WORD_SIZE);
    this.keys[index] &= ~(1 << (keyCode - index * WORD_SIZE));
    this.keyEventHandlers
      .filter((item) => item.code === keyCode)
      .forEach((item) => item.callback("up"));
  };

  private windowBlurHandler = () => {
    const keycodes = [87, 65, 83, 68, 38, 37, 40, 39];
    keycodes.forEach((keyCode) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      this.keyUpHandler({ keyCode: keyCode });
    });
  };

  private keyEventHandlers: {
    code: number;
    callback: (eventType: "down" | "up") => void;
  }[] = [];

  public on(key: number, callback: (eventType: "down" | "up") => void) {
    this.keyEventHandlers.push({ code: key, callback: callback });
  }

  public off(key: number, callback: (eventType: "down" | "up") => void) {
    this.keyEventHandlers = this.keyEventHandlers.filter(
      (item) => item.callback !== callback || item.code !== key
    );
  }
}

const KeyPoll = KeyPollSingleton.getInstance();
export default KeyPoll;
