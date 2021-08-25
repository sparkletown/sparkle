import Command from "./Command";
import { LoadImage } from "./LoadImage";

export class CropVenue implements Command {
  private resolve?: Function;
  public canvas: HTMLCanvasElement;

  constructor(private url: string) {
    this.canvas = document.createElement("canvas");
  }

  public execute(): Promise<CropVenue> {
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

        const size = Math.min(comm.image.width, comm.image.height);
        this.canvas.width = size;
        this.canvas.height = size;

        const ctx: CanvasRenderingContext2D = this.canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;

        const x = 0;
        const y = 0;
        const radius = size / 3;
        const width = size;
        const height = size;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.clip();

        ctx.drawImage(
          comm.image,
          Math.ceil((comm.image.width - size) / 2),
          Math.ceil((comm.image.height - size) / 2),
          comm.image.width,
          comm.image.height,
          0,
          0,
          comm.image.width,
          comm.image.height
        );

        ctx.restore();

        return Promise.resolve();
      })
      .catch((error) => {
        const size = 128;
        this.canvas.width = size;
        this.canvas.height = size;

        const ctx: CanvasRenderingContext2D = this.canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        ctx.fillStyle = "#cc0000";
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return Promise.resolve();
      })
      .finally(() => {
        this.complete();
      });
  }
}
