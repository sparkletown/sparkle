export class Key {
  public object;
  public time: number;
  constructor(object: Object, time: number) {
    this.object = object;
    this.time = time;
  }
}

export class KeyFramer {
  private callback: Function;
  private keys = new Array<Key>();

  /**
   *
   * @param callback it will be invoked for key frames interpolation
   */
  constructor(callback: Function) {
    this.callback = callback;
  }

  public addKey(object: Object, time: number) {
    this.keys.push(new Key(object, time));
    this.keys.sort((a, b) => {
      return a.time - b.time;
    });
  }

  public removeKey(index: number) {
    this.keys.splice(index, 1);
  }

  public getFrame(time: number) {
    const maxIndex = this.keys.findIndex((e) => e.time >= time);
    const minIndex = (maxIndex - 1) % this.keys.length;
    return this.callback(
      this.keys[minIndex].object,
      this.keys[maxIndex].object,
      (time - this.keys[minIndex].time) /
        (this.keys[maxIndex].time - this.keys[minIndex].time)
    );
  }
}
