import Command from "./Command";
import { LoadImage } from "./LoadImage";

export class RoundAvatar implements Command {
  private resolve?: Function;
  public canvas?: HTMLCanvasElement;

  constructor(private url?: string) {}

  public execute(): Promise<RoundAvatar> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.doIt();
    });
  }

  private complete() {
    if (this.resolve) {
      this.resolve(this);
      this.resolve = undefined;
    }
  }

  private doIt() {
    new LoadImage(this.url)
      .execute()
      .then((comm: LoadImage) => {
        if (!comm.image) return console.error();

        const canvas = document.createElement("canvas");
        const size = Math.min(comm.image.width, comm.image.height);
        canvas.width = size;
        canvas.height = size;

        const ctx: CanvasRenderingContext2D = canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(comm.image, 0, 0);

        this.canvas = canvas;
        return Promise.resolve();
      })
      .catch((error) => {
        const canvas = document.createElement("canvas");
        const size = 128;
        canvas.width = size;
        canvas.height = size;

        const ctx: CanvasRenderingContext2D = canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        ctx.fillStyle = "#6108e6";
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
