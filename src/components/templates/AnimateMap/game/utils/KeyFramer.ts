export type KeyData = number[];
export type LinearInterpolationCallback = (
  left: KeyData,
  right: KeyData,
  dt: number
) => number[];

export interface Key {
  time: number;
  data: KeyData;
}

export class KeyFramer {
  constructor(
    private _callback: LinearInterpolationCallback,
    private _keyframes: Key[] = []
  ) {
    this._sort();
  }

  private _sort() {
    this._keyframes.sort((a, b) => a.time - b.time);
  }

  public addKeys(keyframes: Key[]) {
    this._keyframes.push(...keyframes);
    this._sort();
  }

  public removeKey(index: number) {
    this._keyframes.splice(index, 1);
  }

  public getFrame(time: number) {
    const maxIndex = this._keyframes.findIndex((frame) => frame.time >= time);
    const minIndex = (maxIndex - 1) % this._keyframes.length;
    const minFrame = this._keyframes[minIndex];
    const maxFrame = this._keyframes[maxIndex];
    return this._callback(
      minFrame.data,
      maxFrame.data,
      (time - minFrame.time) / (maxFrame.time - minFrame.time)
    );
  }
}
