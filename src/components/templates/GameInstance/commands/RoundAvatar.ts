import { GameConfig } from "../../GameConfig/GameConfig";

import Command from "./Command";
import { LoadImage } from "./LoadImage";

export class RoundAvatar implements Command {
  private resolve?: Function;
  public canvas: HTMLCanvasElement;

  constructor(private url?: string) {
    this.canvas = document.createElement("canvas");
  }

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
    const size = GameConfig.AVATAR_TEXTURE_DEFAULT_SIZE;
    new LoadImage(this.url)
      .execute()
      .then((comm: LoadImage) => {
        if (!comm.image) return console.error();

        this.canvas.width = size;
        this.canvas.height = size;

        const ctx = this.canvas.getContext("2d");
        if (ctx) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
          ctx.globalCompositeOperation = "source-in";

          let sx = 0;
          let sy = 0;
          if (comm.image.width > comm.image.height) {
            sx = (comm.image.width - comm.image.height) / 2;
          } else if (comm.image.width < comm.image.height) {
            sy = (comm.image.height - comm.image.width) / 2;
          }
          ctx.drawImage(
            comm.image,
            sx,
            sy,
            comm.image.width - sx * 2,
            comm.image.height - sy * 2,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );

          ctx.restore();

          return Promise.resolve();
        }
      })
      .catch((error) => {
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
        ctx.globalCompositeOperation = "source-in";

        return Promise.resolve();
      })
      .finally(() => {
        this.complete();
      });
  }
}
