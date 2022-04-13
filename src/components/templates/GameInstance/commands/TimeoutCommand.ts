import Command from "./Command";

export class TimeoutCommand implements Command {
  constructor(private timeout = 100) {}

  public execute(): Promise<Command> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this);
      }, this.timeout);
    });
  }
}
