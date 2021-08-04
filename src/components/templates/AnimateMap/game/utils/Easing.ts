export function easeInOutQuad(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
) {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}

export class Easing {
  public currentValue: number;
  private startTime: number;

  public complete = false;

  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public transition: Function = easeInOutQuad
  ) {
    this.startTime = Date.now();
    this.currentValue = this.startValue;
  }

  public onComplete: Function | null = null;
  public onStep: Function | null = null;

  public clear(): void {
    this.onComplete = null;
    this.onStep = null;
  }

  public update(time: number): void {
    let currentTime = Date.now();

    let elapsed = (currentTime - this.startTime) / this.duration;
    elapsed = this.duration === 0 || elapsed > 1 ? 1 : elapsed;

    if (elapsed === 1) {
      this.complete = true;
      this.currentValue = this.endValue;

      if (this.onStep) {
        this.onStep(this.currentValue);
      }
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      this.currentValue = this.transition(
        currentTime - this.startTime,
        this.startValue,
        this.endValue - this.startValue,
        this.duration
      );

      if (this.onStep) {
        this.onStep(this.currentValue);
      }
    }
  }
}
