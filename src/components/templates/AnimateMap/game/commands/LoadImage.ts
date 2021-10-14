import Command from "./Command";

export class LoadImage implements Command {
  public image?: HTMLImageElement;

  constructor(public url?: string) {}

  execute(): Promise<LoadImage> {
    const img: HTMLImageElement = new Image();

    return new Promise((resolve, reject) => {
      img.crossOrigin = "Anonymous";
      img.addEventListener(
        "load",
        () => {
          this.image = img;
          resolve(this);
        },
        false
      );
      img.addEventListener(
        "error",
        () => {
          reject(this);
        },
        false
      );
      img.src = this.url ?? "";
    });
  }
}
