export class HoverableSpriteComponent {
  constructor(on?: Function, off?: Function, isCursorPointer: boolean = false) {
    if (!isCursorPointer) {
      this.on = on;
      this.off = off;
    } else {
      this.on = on
        ? () => {
            document.body.style.cursor = "pointer";
            on();
          }
        : on;
      this.off = off
        ? () => {
            document.body.style.cursor = "auto";
            off();
          }
        : off;
    }
  }

  public on?: Function;
  public off?: Function;
}
