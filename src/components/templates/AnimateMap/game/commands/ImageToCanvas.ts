import Command from "./Command";

export class ImageToCanvas implements Command {
  public image: HTMLImageElement;
  public canvas: HTMLCanvasElement;
  public scale = 1;

  constructor(image: HTMLImageElement) {
    this.image = image;
    this.canvas = document.createElement("canvas");
  }

  public scaleTo(value: number): this {
    this.scale = value;
    return this;
  }

  execute(): Promise<this> {
    this.canvas.width = this.image.width * this.scale;
    this.canvas.height = this.image.height * this.scale;
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    return Promise.resolve(this);
  }
}
