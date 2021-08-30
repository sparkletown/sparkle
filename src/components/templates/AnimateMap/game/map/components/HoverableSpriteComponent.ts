export class HoverableSpriteComponent {
  public on?: () => void;
  public off?: () => void;

  constructor(
    on?: () => void,
    off?: () => void,
    isCursorPointer: boolean = true
  ) {
    if (!isCursorPointer) {
      this.on = on;
      this.off = off;
      return;
    }
    this.on = () => {
      if (!on) return;
      document.body.style.cursor = "pointer";
      on();
    };
    this.off = () => {
      if (!off) return;
      document.body.style.cursor = "auto";
      off();
    };
  }
}
