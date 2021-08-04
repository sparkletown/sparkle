import * as Keyboard from "../../utils/Keyboard";

export class MotionKeyboardControlComponent {
  public left: Array<number> = [Keyboard.LEFT, Keyboard.A];
  public right: Array<number> = [Keyboard.RIGHT, Keyboard.D];
  public up: Array<number> = [Keyboard.UP, Keyboard.W];
  public down: Array<number> = [Keyboard.DOWN, Keyboard.S];
}
