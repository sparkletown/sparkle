import Command from "./Command";

export class RoundAvatar implements Command {
  private resolve: Function | null = null;
  public canvas: HTMLCanvasElement | null = null;

  constructor(private url: string) {}

  public execute(): Promise<RoundAvatar> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.doIt();
    });
  }

  private complete(): void {
    if (this.resolve) {
      this.resolve(this);
      this.resolve = null;
    }
  }

  private doIt(): void {
    const img: HTMLImageElement = new Image();

    new Promise((resolve, reject) => {
      img.crossOrigin = "Anonymous";
      img.addEventListener(
        "load",
        () => {
          resolve(img);
        },
        false
      );
      img.addEventListener(
        "error",
        () => {
          reject(img);
        },
        false
      );
      img.src = this.url;
    })
      .then(() => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, 0, 0);

        this.canvas = canvas;
        return Promise.resolve();
      })
      .catch((error) => {
        const canvas = document.createElement("canvas");
        const size = 128;
        canvas.width = size;
        canvas.height = size;

        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        ctx.fillStyle = "#cc0000";
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        this.canvas = canvas;
        return Promise.resolve();
      })
      .finally(() => {
        this.complete();
      });
  }
}
