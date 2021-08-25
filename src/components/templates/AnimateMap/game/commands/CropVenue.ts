import { GameConfig } from "../../configs/GameConfig";
import { VENUE_PEOPLE } from "../constants/AssetConstants";

import Command from "./Command";
import { LoadImage } from "./LoadImage";

export class CropVenue implements Command {
  private resolve?: Function;
  public canvas: HTMLCanvasElement;
  public usersCount = 0;

  constructor(private url: string, private venueIsEnabled = false) {
    this.canvas = document.createElement("canvas");
  }

  public setUsersCount(usersCount: number): this {
    this.usersCount = usersCount;
    return this;
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
        const scale = size / GameConfig.VENUE_DEFAULT_SIZE;
        this.canvas.width = size * scale;
        this.canvas.height = size * scale;

        const ctx: CanvasRenderingContext2D = this.canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;

        this.drawPath(ctx);

        ctx.drawImage(
          comm.image,
          Math.ceil((comm.image.width - size) / 2) * scale,
          Math.ceil((comm.image.height - size) / 2) * scale,
          comm.image.width,
          comm.image.height,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );

        ctx.restore();

        // draw frame
        const frameCanvas = document.createElement("canvas");
        const frameCtx = frameCanvas.getContext("2d");
        if (frameCanvas && frameCtx) {
          frameCanvas.width = this.canvas.width;
          frameCanvas.height = this.canvas.height;
        }
        this.drawFrame(ctx);
        return this.drawUsersCount(ctx);
      })
      .catch((error) => {
        console.log("CropVenue", error);
        const size = GameConfig.VENUE_DEFAULT_SIZE;
        this.canvas.width = size;
        this.canvas.height = size;

        const ctx: CanvasRenderingContext2D = this.canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        ctx.fillStyle = "#cc0000";
        this.drawPath(ctx);
        ctx.fill();

        this.drawFrame(ctx);
        return this.drawUsersCount(ctx);
      })
      .finally(() => {
        this.complete();
      });
  }

  private drawUsersCount(ctx: CanvasRenderingContext2D): Promise<void> {
    if (this.usersCount === 0) {
      return Promise.resolve();
    }

    const width = ctx.canvas.width * 0.45;
    const height = (ctx.canvas.height * 0.45) / 3;
    const x = (ctx.canvas.width - width) / 2;
    const stroke = (ctx.canvas.width * 0.1) / 2;
    const radius = width / 6;

    ctx.save();
    ctx.fillStyle = this.venueIsEnabled
      ? "rgba(124, 70, 251, 0.5)"
      : "rgba(0, 0, 0, .5)";

    ctx.beginPath();
    ctx.moveTo(x, ctx.canvas.height - stroke);
    ctx.lineTo(x, ctx.canvas.height - stroke - height + radius);
    ctx.quadraticCurveTo(
      x,
      ctx.canvas.height - stroke - height,
      x + radius,
      ctx.canvas.height - stroke - height
    );
    ctx.lineTo(x + width - radius, ctx.canvas.height - stroke - height);
    ctx.quadraticCurveTo(
      x + width,
      ctx.canvas.height - stroke - height,
      x + width,
      ctx.canvas.height - stroke - height + radius
    );
    ctx.lineTo(x + width, ctx.canvas.height - stroke);
    ctx.lineTo(x, ctx.canvas.height - stroke);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = `${height * 0.7}px arial`;
    ctx.fillText(
      `${this.usersCount}`,
      x + width * 0.45,
      ctx.canvas.height - stroke * 1.6
    );

    return new LoadImage(VENUE_PEOPLE)
      .execute()
      .then((comm: LoadImage) => {
        if (comm.image) {
          const imageScale = (height / comm.image.height) * 0.8;
          ctx.drawImage(
            comm.image,
            0,
            0,
            comm.image.width,
            comm.image.height,
            x + stroke,
            ctx.canvas.height - height - stroke / 2,
            comm.image.width * imageScale,
            comm.image.height * imageScale
          );
        }
      })
      .catch((error) => {
        console.log("drawUsersCount", error);
      })
      .finally(() => {
        return Promise.resolve();
      });
  }

  private drawFrame(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = this.canvas.width * 0.1;
    this.drawPath(ctx);
    ctx.stroke();
  }

  private drawPath(ctx: CanvasRenderingContext2D): void {
    const x = 0;
    const y = 0;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const radius = Math.min(width, height) / 3;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
  }
}
