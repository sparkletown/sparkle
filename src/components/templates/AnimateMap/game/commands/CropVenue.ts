import { venues } from "../constants/AssetConstants";
import { GameInstance } from "../GameInstance";

import Command from "./Command";
import { ImageToCanvas } from "./ImageToCanvas";
import { LoadImage } from "./LoadImage";

export class CropVenue implements Command {
  private config = GameInstance.instance.getConfig();
  private resolve?: Function;
  public canvas: HTMLCanvasElement;
  public usersCount = 0;
  public withoutPlate = false;
  public usersCountColor = "rgb(0, 0, 0, 0.5)";

  private static VENUE_PLATE?: HTMLCanvasElement;
  private static VENUE_PEOPLE?: HTMLCanvasElement;

  constructor(private url: string) {
    this.canvas = document.createElement("canvas");
  }

  public setWithoutPlate(value: boolean = false): this {
    this.withoutPlate = value;
    return this;
  }

  public setUsersCount(usersCount: number): this {
    this.usersCount = usersCount;
    return this;
  }

  public setUsersCountColor(color: number): this {
    const str = color.toString(16);
    this.usersCountColor = `rgb(${parseInt(
      str.substring(0, 2),
      16
    )}, ${parseInt(str.substring(2, 4), 16)}, ${parseInt(
      str.substring(4),
      16
    )}, 0.5)`;
    return this;
  }

  public execute(): Promise<CropVenue> {
    return new Promise((resolve) => {
      this.resolve = resolve;

      if (!CropVenue.VENUE_PLATE) {
        this.setup().then(() => {
          this.doIt();
        });
      } else {
        this.doIt();
      }
    });
  }

  private complete() {
    if (this.resolve) {
      this.resolve(this);
      this.resolve = undefined;
    }
  }

  private setup(): Promise<void> {
    const size = this.config.VENUE_TEXTURE_DEFAULT_SIZE;

    const plate = new LoadImage(venues.VENUE_PLATE)
      .execute()
      .then((comm) => {
        if (comm.image) {
          const scale = size / comm.image.width;
          return new ImageToCanvas(comm.image).scaleTo(scale).execute();
        } else {
          return Promise.reject();
        }
      })
      .then((comm) => {
        CropVenue.VENUE_PLATE = comm.canvas;
        return Promise.resolve();
      })
      .catch((error) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        CropVenue.VENUE_PLATE = canvas;
        return Promise.resolve();
      });

    const people = new LoadImage(venues.VENUE_PEOPLE)
      .execute()
      .then((comm) => {
        if (comm.image) {
          const scale =
            (this.config.VENUE_TEXTURE_DEFAULT_SIZE / comm.image.height) * 0.8;
          return new ImageToCanvas(comm.image)
            .scaleTo(scale)
            .execute()
            .then((comm) => {
              CropVenue.VENUE_PEOPLE = comm.canvas;
            });
        } else {
          return Promise.reject();
        }
      })
      .catch((error) => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        CropVenue.VENUE_PEOPLE = canvas;
        return Promise.resolve();
      });

    return Promise.all([plate, people]).then(() => {
      return Promise.resolve();
    });
  }

  private doIt(): void {
    if (this.withoutPlate) {
      this.doItWithoutPlate();
    } else {
      this.doItWithPlate();
    }
  }

  private doItWithoutPlate() {
    new LoadImage(this.url)
      .execute()
      .then((comm) => {
        if (!comm.image) return console.error();

        const border = 1;
        this.canvas.width = this.config.VENUE_TEXTURE_DEFAULT_SIZE;
        this.canvas.height =
          comm.image.height * (this.canvas.width / comm.image.width);

        const ctx = this.canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            comm.image,
            0,
            0,
            comm.image.width,
            comm.image.height,
            border,
            border,
            this.canvas.width + border * 2,
            this.canvas.height + border * 2
          );

          return this.drawUsersCount(ctx);
        } else {
          return Promise.reject();
        }
      })
      .finally(() => {
        this.complete();
      });
  }

  private doItWithPlate() {
    new LoadImage(this.url)
      .execute()
      .then((comm: LoadImage) => {
        if (!comm.image) return console.error();

        const border = 1;
        this.canvas.width =
          CropVenue.VENUE_PLATE?.width ||
          this.config.VENUE_TEXTURE_DEFAULT_SIZE;
        this.canvas.height =
          CropVenue.VENUE_PLATE?.height ||
          this.config.VENUE_TEXTURE_DEFAULT_SIZE;

        const ctx = this.canvas.getContext("2d");
        if (ctx) {
          if (CropVenue.VENUE_PLATE) {
            ctx.drawImage(
              CropVenue.VENUE_PLATE,
              0,
              0,
              CropVenue.VENUE_PLATE.width,
              CropVenue.VENUE_PLATE.height,
              border,
              border,
              this.canvas.width - border * 2,
              this.canvas.height - border * 2
            );
          }

          this.drawPath(ctx);

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

          return this.drawUsersCount(ctx);
        } else {
          return Promise.reject();
        }
      })
      .catch((error) => {
        const size = this.config.VENUE_TEXTURE_DEFAULT_SIZE;
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
    const stroke = (ctx.canvas.width * 0.1) / 3;
    const radius = width / 6;

    ctx.save();
    ctx.fillStyle = this.usersCountColor;

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
      ctx.canvas.height - stroke * 2
    );

    if (CropVenue.VENUE_PEOPLE) {
      const imageScale = (height / CropVenue.VENUE_PEOPLE.height) * 0.8;
      ctx.drawImage(
        CropVenue.VENUE_PEOPLE,
        0,
        0,
        CropVenue.VENUE_PEOPLE.width,
        CropVenue.VENUE_PEOPLE.height,
        x + stroke,
        ctx.canvas.height - height - stroke / 2,
        CropVenue.VENUE_PEOPLE.width * imageScale,
        CropVenue.VENUE_PEOPLE.height * imageScale
      );
    }
    return Promise.resolve();
  }

  private drawFrame(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = this.canvas.width * 0.1;
    this.drawPath(ctx);
    ctx.stroke();
  }

  private drawPath(ctx: CanvasRenderingContext2D): void {
    const border = 8;
    const x = border;
    const y = border;
    const width = ctx.canvas.width - border * 2;
    const height = ctx.canvas.height - border * 2;
    const radius = Math.min(width, height) / 2.62;

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
